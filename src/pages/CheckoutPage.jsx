import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, Phone, Mail, User, MessageCircle, Upload, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Truck
    },
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      description: 'Mobile payment via Easypaisa',
      icon: Phone,
      number: '03001234567'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      description: 'Mobile payment via JazzCash',
      icon: Phone,
      number: '03001234567'
    }
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
        setShowPaymentModal(true);
        setSubmitting(false);
        return;
      }

      const orderData = {
        customerInfo: data,
        items: items,
        paymentMethod: paymentMethod
      };

      const response = await axiosInstance.post('/api/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/order-success', { 
          state: { orderId: response.data.order._id } 
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMobilePayment = async () => {
    const formData = getValues();
    setSubmitting(true);
    
    try {
      const orderData = {
        customerInfo: formData,
        items: items,
        paymentMethod: paymentMethod
      };

      const response = await axiosInstance.post('/api/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/order-success', { 
          state: { orderId: response.data.order._id } 
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setShowPaymentModal(false);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <User className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-primary-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="03XX XXXXXXX"
                    />
                    {errors.phone && (
                      <p className="text-primary-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-primary-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      {...register('address.street', { required: 'Street address is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="House #, Street, Area"
                    />
                    {errors.address?.street && (
                      <p className="text-primary-500 text-sm mt-1">{errors.address.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('address.city', { required: 'City is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="City"
                    />
                    {errors.address?.city && (
                      <p className="text-primary-500 text-sm mt-1">{errors.address.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      {...register('address.state')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Punjab, Sindh, KPK, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      {...register('address.zipCode')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Postal Code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register('address.country')}
                      defaultValue="Pakistan"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        paymentMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id ? 'border-primary-600' : 'border-gray-300'
                        }`}>
                          {paymentMethod === method.id && (
                            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                          )}
                        </div>
                        <method.icon className="text-gray-600" size={24} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-gray-600 text-sm">{method.description}</p>
                          {method.number && (
                            <p className="text-primary-600 text-sm font-medium">
                              Number: {method.number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm p-6 sticky top-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-3">
                      <img
                        src={item.images?.[0].url || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>Rs. {getCartTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Free shipping on all orders across Pakistan
                </p>
              </motion.div>
            </div>
          </div>
        </form>

        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Payment Instructions</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  Rs. {getCartTotal().toLocaleString()}
                </div>
                <p className="text-gray-600">Please send this amount to:</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="font-bold text-lg">
                    {paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}: 03001234567
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Send the exact amount: Rs. {getCartTotal().toLocaleString()}</li>
                    <li>• Take a screenshot of the transaction</li>
                    <li>• Send the screenshot via WhatsApp</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={sendToWhatsApp}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={20} />
                    <span>Send via WhatsApp</span>
                  </button>
                  <button
                    onClick={handleMobilePayment}
                    disabled={submitting}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;