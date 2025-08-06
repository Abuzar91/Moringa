import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  X,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  Clock,
  XCircle,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const Orders = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const orderStatuses = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
      icon: CheckCircle,
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-purple-100 text-purple-800",
      icon: Package,
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
      icon: Truck,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  ];

  const paymentStatuses = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
    { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      toast.error("Please enter your order number");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/orders/${orderNumber.trim()}`);

      if (response.data.success) {
        setOrderDetails(response.data.order);
        setShowOrderModal(true);
        toast.success("Order found successfully!");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      if (error.response?.status === 404) {
        toast.error("Order not found. Please check your order number.");
      } else {
        toast.error("Failed to track order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status, type = "order") => {
    const statuses = type === "order" ? orderStatuses : paymentStatuses;
    return (
      statuses.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getStatusIcon = (status) => {
    const statusInfo = orderStatuses.find((s) => s.value === status);
    const IconComponent = statusInfo?.icon || Package;
    return IconComponent;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressPercentage = (status) => {
    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(status);
    if (status === "cancelled") return 100;
    return currentIndex >= 0
      ? ((currentIndex + 1) / statusOrder.length) * 100
      : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Orders
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your order number to track your shipment and see the current
            status of your order.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="orderNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Order Number
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number (e.g., CG000001)"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You can find your order number in the confirmation email we sent
                you.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Tracking Order...</span>
                </div>
              ) : (
                "Track Order"
              )}
            </button>
          </form>
        </div>

        {showOrderModal && orderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Order #{orderDetails.orderNumber}
                  </h3>
                  <p className="text-gray-600">
                    Placed on {formatDate(orderDetails.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Order Status
                  </h4>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      orderDetails.orderStatus
                    )}`}
                  >
                    {React.createElement(
                      getStatusIcon(orderDetails.orderStatus),
                      { size: 16, className: "mr-1" }
                    )}
                    {orderStatuses.find(
                      (s) => s.value === orderDetails.orderStatus
                    )?.label || orderDetails.orderStatus}
                  </span>
                </div>

                {orderDetails.orderStatus !== "cancelled" && (
                  <div className="relative">
                    <div className="flex justify-between mb-2">
                      {[
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                      ].map((status, index) => {
                        const isActive =
                          [
                            "pending",
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].indexOf(orderDetails.orderStatus) >= index;
                        const IconComponent = getStatusIcon(status);

                        return (
                          <div
                            key={status}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                isActive
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              <IconComponent size={20} />
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                isActive ? "text-green-600" : "text-gray-400"
                              }`}
                            >
                              {
                                orderStatuses.find((s) => s.value === status)
                                  ?.label
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-green-600 transition-all duration-500"
                        style={{
                          width: `${getProgressPercentage(
                            orderDetails.orderStatus
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {orderDetails.orderStatus === "cancelled" && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-red-600">
                        Order Cancelled
                      </p>
                      <p className="text-gray-600 mt-2">
                        This order has been cancelled
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="mr-2" size={20} />
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">
                        {orderDetails.customerInfo?.fullName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">
                        {orderDetails.customerInfo?.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">
                        {orderDetails.customerInfo?.phone}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                      <div className="text-gray-900">
                        <p>{orderDetails.customerInfo?.address?.street}</p>
                        <p>
                          {orderDetails.customerInfo?.address?.city},{" "}
                          {orderDetails.customerInfo?.address?.state}{" "}
                          {orderDetails.customerInfo?.address?.zipCode}
                        </p>
                        <p>{orderDetails.customerInfo?.address?.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Order Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">
                        {formatDate(orderDetails.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900 uppercase">
                        {orderDetails.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          orderDetails.paymentStatus,
                          "payment"
                        )}`}
                      >
                        {
                          paymentStatuses.find(
                            (s) => s.value === orderDetails.paymentStatus
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">
                          Rs. {orderDetails.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Package className="mr-2" size={20} />
                  Order Items ({orderDetails.items?.length || 0} items)
                </h4>
                <div className="space-y-4">
                  {orderDetails.items?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={
                          item.productSnapshot?.image ||
                          ""
                        }
                        alt={item.productSnapshot?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">
                          {item.productSnapshot?.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: Rs. {item.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          Rs.{" "}
                          {(
                            (item.price || 0) * (item.quantity || 0)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {orderDetails.statusHistory &&
                orderDetails.statusHistory.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="mr-2" size={20} />
                      Order History
                    </h4>
                    <div className="space-y-3">
                      {orderDetails.statusHistory.map((history, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-3 h-3 rounded-full mt-2 ${
                              getStatusColor(history.status).includes(
                                "bg-green"
                              )
                                ? "bg-green-500"
                                : getStatusColor(history.status).includes(
                                    "bg-blue"
                                  )
                                ? "bg-blue-500"
                                : getStatusColor(history.status).includes(
                                    "bg-yellow"
                                  )
                                ? "bg-yellow-500"
                                : getStatusColor(history.status).includes(
                                    "bg-red"
                                  )
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 capitalize">
                                {history.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(history.date || history.timestamp)}
                              </span>
                            </div>
                            {history.note && (
                              <p className="text-sm text-gray-600 mt-1">
                                {history.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {orderDetails.adminNotes && (
                <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                  <h5 className="font-semibold text-blue-900 mb-2">
                    Order Notes:
                  </h5>
                  <p className="text-blue-800">{orderDetails.adminNotes}</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
