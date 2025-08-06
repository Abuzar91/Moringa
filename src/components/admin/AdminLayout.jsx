import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Megaphone,
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from "../Logo"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-primary-100`}>
        
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-primary-500 to-primary-600">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Logo size="md" variant='white'/>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-primary-700 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-primary-100 bg-primary-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center">
              <span className="text-primary-700 font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full inline-block">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4 flex-1">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 shadow-sm border border-primary-200'
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                    }`}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-primary-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-500" />
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="bg-white shadow-sm border-b border-primary-100 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-all"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
            <div className="w-10"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;