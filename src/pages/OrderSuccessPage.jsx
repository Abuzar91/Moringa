import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MessageCircle, Mail, Home } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderNumber, paymentMethod, customerName, totalAmount } = location.state || {};

  const sendToWhatsApp = () => {
    const whatsappNumber = "+923249090438";
    const message = `Hi! I've placed order ${orderNumber} and need to send payment screenshot for ${paymentMethod?.toUpperCase()}. Please confirm receipt.`;
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
           Thank you {customerName ? `${customerName}` : ''} for choosing Eleve. Your premium moringa soap order has been received and is being processed.
          </p>

          {orderNumber && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-bold text-pink-600">{orderNumber}</span>
                </div>
                {paymentMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{paymentMethod.toUpperCase()}</span>
                  </div>
                )}
                {totalAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-pink-600">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                Payment Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Please send your payment screenshot via WhatsApp to complete your order.
              </p>
              <button
                onClick={sendToWhatsApp}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <MessageCircle size={20} />
                <span>Send Screenshot via WhatsApp</span>
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Order Confirmation</h4>
              <p className="text-gray-600 text-sm">
                You'll receive an email confirmation with order details shortly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Order Processing</h4>
              <p className="text-gray-600 text-sm">
                We'll prepare your order and notify you when it's shipped.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Stay Connected</h4>
              <p className="text-gray-600 text-sm">
                Contact us anytime via WhatsApp for order updates.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="px-8 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors duration-200 font-semibold"
            >
              Track Order
            </Link>
            <Link
              to="/"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-gray-600 mb-4">
              Need help with your order? Contact us:
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 flex items-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:info@creamglow.pk"
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
              >
                <Mail size={20} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;