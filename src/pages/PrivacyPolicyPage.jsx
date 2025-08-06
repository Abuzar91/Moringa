import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, UserCheck, Database, Globe, Mail, Phone } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const PrivacyPolicyPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Privacy Policy', path: '/privacy-policy' }
  ];

  const privacySections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal information you provide (name, email, phone, address)',
        'Order and payment information',
        'Website usage data and preferences',
        'Communication records with our support team',
        'Device and browser information for website optimization'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: UserCheck,
      content: [
        'Process and fulfill your orders',
        'Send order confirmations and shipping updates',
        'Provide customer support and respond to inquiries',
        'Improve our products and website experience',
        'Send promotional offers (with your consent)',
        'Comply with legal obligations'
      ]
    },
    {
      title: 'Information Sharing',
      icon: Globe,
      content: [
        'We never sell your personal information to third parties',
        'Shipping information is shared only with delivery partners',
        'Payment information is processed securely through trusted payment gateways',
        'We may share information if required by law or to protect our rights',
        'Anonymous, aggregated data may be used for business analytics'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'We use industry-standard encryption to protect your data',
        'Secure payment processing through trusted providers',
        'Regular security audits and updates',
        'Limited access to personal information by authorized personnel only',
        'Secure data storage with backup and recovery systems'
      ]
    }
  ];

  const contactInfo = [
    {
      method: 'Email',
      value: 'privacy@moringacare.pk',
      icon: Mail,
      description: 'For privacy-related inquiries'
    },
    {
      method: 'WhatsApp',
      value: '+92 300 1234567',
      icon: Phone,
      description: 'Quick privacy questions'
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Your privacy is important to us. Learn how we collect, use, and protect your personal information.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Last updated: January 2024
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-primary-50 border border-primary-200 rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              At MoringaCare, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase from us. By using our services, you agree to the collection and use of information in accordance 
              with this policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-primary-100"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-lg text-gray-600">You have the following rights regarding your personal information</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Access Your Data',
                description: 'Request a copy of the personal information we have about you',
                icon: Eye
              },
              {
                title: 'Update Information',
                description: 'Correct or update your personal information at any time',
                icon: UserCheck
              },
              {
                title: 'Delete Your Data',
                description: 'Request deletion of your personal information (subject to legal requirements)',
                icon: Database
              },
              {
                title: 'Opt-Out',
                description: 'Unsubscribe from marketing communications at any time',
                icon: Shield
              }
            ].map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-50 border border-primary-200 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <right.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{right.title}</h3>
                </div>
                <p className="text-gray-700">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookies Policy */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-primary-100"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, 
                and understand where our visitors are coming from. Cookies are small data files stored on your device.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Required for website functionality</li>
                    <li>• Shopping cart and checkout process</li>
                    <li>• Security and authentication</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Help us understand website usage</li>
                    <li>• Improve user experience</li>
                    <li>• Anonymous traffic analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Privacy Questions?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Contact us if you have any questions about this Privacy Policy or how we handle your data
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-4 mx-auto">
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{contact.method}</h3>
                  <p className="text-primary-100 text-sm mb-2">{contact.description}</p>
                  <p className="font-medium">{contact.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">
            This Privacy Policy was last updated on January 1, 2024. We may update this policy from time to time. 
            Any changes will be posted on this page with an updated revision date.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;