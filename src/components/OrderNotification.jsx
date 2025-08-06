import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

const OrderNotification = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const customers = ['Sabeeha', 'Sana', 'Ayesha', 'Minhas', 'Sania', 'Javeria'];
  const products = [
    'Moringa + Tea Tree Oil Soap',
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const generateNotification = () => {
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const timeAgo = Math.floor(Math.random() * 30) + 1; 
    
    return {
      id: Date.now(),
      customer: randomCustomer,
      product: randomProduct,
      timeAgo: timeAgo,
      location: ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi'][Math.floor(Math.random() * 5)]
    };
  };

  useEffect(() => {
    const showNotification = () => {
      const notification = generateNotification();
      setCurrentNotification(notification);
      setIsVisible(true);
      
      // Hide notification after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Show first notification after 30 seconds
    const initialTimeout = setTimeout(showNotification, 30000);
    // Show subsequent notifications every 40 seconds (30s + 6s visible + 4s gap)
    const interval = setInterval(showNotification, 40000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentNotification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            x: isMobile ? 0 : -100, 
            y: isMobile ? -100 : 0,
            scale: 0.8 
          }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: 0,
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            x: isMobile ? 0 : -100, 
            y: isMobile ? -100 : 0,
            scale: 0.8 
          }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut" 
          }}
          className={`fixed z-50 ${
            isMobile 
              ? 'top-4 left-4 right-4' 
              : 'bottom-6 left-6 w-80'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-primary-100 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                  >
                    <ShoppingBag size={14} className="text-white" />
                  </motion.div>
                  <span className="text-white font-semibold text-sm">Recent Order</span>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {currentNotification.customer.charAt(0)}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium">
                    <span className="font-semibold text-primary-600">
                      {currentNotification.customer}
                    </span>
                    {' '}from {currentNotification.location}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    just ordered {currentNotification.product}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                            Just Now
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity 
                    }}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                </div>
              </div>

              {/* Trust indicator */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>✓ Verified Purchase</span>
                  <span className="text-primary-600 font-medium">🌿 Natural Soap</span>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <motion.div
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 6 }}
              className="h-1 bg-gradient-to-r from-primary-400 to-primary-600"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderNotification;