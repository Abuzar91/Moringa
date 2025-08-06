import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumb = ({ customItems = [] }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeMap = {
    products: 'Products',
    product: 'Product Details',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    orders: 'Track Orders',
    about: 'About Us',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    admin: 'Admin',
    dashboard: 'Dashboard',
    users: 'Users'
  };

  const breadcrumbItems = customItems.length > 0 ? customItems : [
    { label: 'Home', path: '/' },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        label: routeMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
        path: routeTo
      };
    })
  ];

  if (breadcrumbItems.length <= 1) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-sm text-gray-600 mb-6 bg-white px-4 py-3 rounded-lg shadow-sm"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index === 0 && (
            <Home className="w-4 h-4 text-gray-400 mr-1" />
          )}
          
          {index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.path}
              className="hover:text-pink-600 transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">{item.label}</span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;