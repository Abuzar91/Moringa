import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, CheckCircle, XCircle, Package, Shield, AlertTriangle, MessageCircle } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ReturnsExchangesPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Returns & Exchanges', path: '/returns-exchanges' }
  ];

  const returnSteps = [
    {
      step: 1,
      title: 'Contact Us',
      description: 'Reach out within 30 days of delivery via WhatsApp or email',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      step: 2,
      title: 'Return Authorization',
      description: 'We\'ll provide return instructions and authorization',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      step: 3,
      title: 'Package & Send',
      description: 'Pack items in original condition and send back',
      icon: Package,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      step: 4,
      title: 'Refund/Exchange',
      description: 'Receive refund or exchange within 7-10 business days',
      icon: RotateCcw,
      color: 'bg-primary-100 text-primary-600'
    }
  ];

  const eligibleItems = [
    'Unopened soap packages in original condition',
    'Items with manufacturing defects',
    'Wrong items delivered',
    'Damaged items during shipping'
  ];

  const nonEligibleItems = [
    'Opened or used soap products',
    'Items damaged by customer',
    'Products without original packaging',
    'Items returned after 30 days'
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
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Returns & Exchanges
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Your satisfaction is our priority. Easy returns and exchanges for MoringaCare products
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 30-Day Guarantee */}
      <section className="py-12 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-lg sm:text-xl opacity-90">
              Not satisfied? Return unopened products within 30 days for a full refund
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Return Process
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Simple steps to return or exchange your order
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {returnSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-8 h-8" />
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

      {/* Eligibility */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Return Eligibility
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              What can and cannot be returned
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-semibold text-green-900">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-xl font-semibold text-red-900">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">{item}</span>
                  </li>
                ))}
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
              Need to Return Something?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Contact our customer support team to start your return or exchange process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="mr-2" size={20} />
                WhatsApp Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Email Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ReturnsExchangesPage;