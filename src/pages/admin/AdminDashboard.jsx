import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  ShoppingCart,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/dashboard/stats?period=${period}`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const dailySales = stats?.dailySales || [];
  const orderStatusStats = stats?.orderStatusStats || [];
  const paymentMethodStats = stats?.paymentMethodStats || [];
  const topProducts = stats?.topProducts || [];
  const recentOrders = stats?.recentOrders || [];

  const uniqueCustomers = recentOrders.reduce((acc, order) => {
    if (!acc.includes(order.customerInfo?.email)) {
      acc.push(order.customerInfo?.email);
    }
    return acc;
  }, []).length;

  const salesChartData = dailySales.map(item => ({
    date: `${item._id.day}/${item._id.month}`,
    sales: item.sales,
    orders: item.orders
  }));

  const orderStatusChartData = orderStatusStats.map(item => ({
    name: item._id,
    value: item.count
  }));

  const paymentMethodChartData = paymentMethodStats.map(item => ({
    name: item._id.toUpperCase(),
    orders: item.count,
    revenue: item.revenue
  }));

  const COLORS = ['#b7cdb8', '#9bc19d', '#7fb582', '#63a967', '#4f8752'];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change} this period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back to Eleve admin panel</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${overview.totalRevenue?.toLocaleString() || 0}`}
            change={overview.recentRevenue}
            icon={DollarSign}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Total Orders"
            value={overview.totalOrders || 0}
            change={overview.recentOrders}
            icon={ShoppingCart}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Products"
            value={overview.totalProducts || 0}
            icon={Package}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Customers"
            value={uniqueCustomers || overview.totalUsers || 0}
            change={overview.recentUsers}
            icon={Users}
            color="bg-gradient-to-r from-primary-500 to-primary-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `Rs. ${value.toLocaleString()}` : value,
                  name === 'sales' ? 'Sales' : 'Orders'
                ]} />
                <Line type="monotone" dataKey="sales" stroke="#b7cdb8" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#63a967" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Order Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
              <TrendingUp className="text-gray-400" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethodChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#b7cdb8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.totalSold} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Rs. {product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">Order ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Customer</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Amount</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order._id} className="border-b border-gray-100">
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {order.customerInfo.fullName}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <button className="text-primary-600 hover:text-primary-700">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;