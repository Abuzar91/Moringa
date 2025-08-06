import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ShippingInfoPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shipping Info', path: '/shipping-info' }
  ];

  const shippingZones = [
    {
      zone: 'Major Cities',
      cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'],
      time: '2-3 business days',
      cost: 'Free',
      icon: Truck,
      color: 'bg-green-100 text-green-600'
    },
    {
      zone: 'Other Cities',
      cities: ['Peshawar', 'Quetta', 'Multan', 'Sialkot', 'Gujranwala'],
      time: '3-4 business days',
      cost: 'Free',
      icon: Package,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      zone: 'Remote Areas',
      cities: ['Rural areas', 'Small towns', 'Villages'],
      time: '4-5 business days',
      cost: 'Free',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const shippingSteps = [
    {
      step: 1,
      title: 'Order Confirmation',
      description: 'Your order is confirmed and payment is processed',
      icon: CheckCircle
    },
    {
      step: 2,
      title: 'Processing',
      description: 'We carefully prepare and package your soaps',
      icon: Package
    },
    {
      step: 3,
      title: 'Shipped',
      description: 'Your order is dispatched and tracking info is sent',
      icon: Truck
    },
    {
      step: 4,
      title: 'Delivered',
      description: 'Your MoringaCare soaps arrive at your doorstep',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb customItems={breadcrumbItems} />
      </div>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Shipping Information
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Fast, reliable, and free shipping across Pakistan for all MoringaCare natural soap orders
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="py-12 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">🎉 FREE SHIPPING NATIONWIDE! 🎉</h2>
            <p className="text-lg sm:text-xl opacity-90">
              No minimum order required • All orders ship free across Pakistan
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Delivery Timeframes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Estimated delivery times based on your location
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {shippingZones.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${zone.color} rounded-2xl mb-6`}>
                  <zone.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{zone.zone}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery Time:</span>
                    <span className="font-semibold text-primary-600">{zone.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shipping Cost:</span>
                    <span className="font-semibold text-green-600">{zone.cost}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Includes:</p>
                  {zone.cities.map((city, cityIndex) => (
                    <p key={cityIndex} className="text-sm text-gray-600">• {city}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Shipping Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              From order to delivery - here's what happens
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {shippingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Important Shipping Information
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Info className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-900">Shipping Policy</h3>
              </div>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Free shipping on all orders across Pakistan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Orders are processed within 24 hours</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Tracking information provided for all orders</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Secure packaging to protect your soaps</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-yellow-900">Please Note</h3>
              </div>
              <ul className="space-y-3 text-yellow-800">
                <li className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Delivery times may vary during peak seasons or holidays</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Remote areas may require additional 1-2 days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Package className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Orders placed after 5 PM ship the next business day</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>We're not responsible for delays by courier services</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Questions About Shipping?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our customer support team is here to help with any shipping inquiries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShippingInfoPage;