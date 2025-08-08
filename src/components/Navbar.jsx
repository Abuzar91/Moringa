import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, Heart, LayoutDashboard, Bell, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import AnnouncementBar from './AnnouncementBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Moringa Soaps', href: '/products', current: location.pathname === '/products' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
    { name: 'Track Order', href: '/orders', current: location.pathname === '/orders' },
  ];

  return (
    <>
      <AnnouncementBar />
      <nav className="bg-white shadow-lg sticky top-0 z-40 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="block lg:hidden">
                  <Logo size="md" />
                </div>
                <div className="hidden lg:block">
                  <Logo size="md" />
                </div>
              </Link>
            </div>

            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navigation.map((item) => (
                  <div key={item.name} className="relative">
                    {item.dropdown ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowCustomerCareDropdown(!showCustomerCareDropdown)}
                          className="flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                        >
                          {item.name}
                          <ChevronDown size={16} className="ml-1" />
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                          item.current
                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                      >
                        {item.name}
                        {item.current && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/cart"
                className="p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 relative group"
              >
                <ShoppingCart size={20} />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium animate-bounce-gentle">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              <div className="relative">
                {user ? (
                  <div className="flex items-center space-x-3">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                        title="Admin Dashboard"
                      >
                        <LayoutDashboard size={20} />
                      </Link>
                    )}
                    <div className="flex items-center space-x-2 bg-primary-50 rounded-xl px-4 py-2">
                      <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-primary-700 font-medium hidden sm:block">
                        {user.name}
                      </span>
                      <button
                        onClick={logout}
                        className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                  >
                    <User size={18} />
                    <span className="hidden sm:block">Login</span>
                  </Link>
                )}
              </div>

              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-primary-100">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <div className="px-4 py-3 text-base font-medium text-gray-700">
                        {item.name}
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        item.current
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {!user && (
                <Link
                  to="/auth"
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;