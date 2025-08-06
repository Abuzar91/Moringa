import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'FAQ', path: '/faq' }
  ];

  const faqCategories = [
    { id: 'all', label: 'All Questions' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders & Shipping' },
    { id: 'returns', label: 'Returns & Exchanges' },
    { id: 'ingredients', label: 'Ingredients & Safety' },
    { id: 'usage', label: 'Usage & Care' }
  ];

  const faqs = [
    {
      category: 'products',
      question: 'What makes MoringaCare soaps different from regular soaps?',
      answer: 'Our soaps are handcrafted with 100% natural ingredients, primarily moringa leaves and tea tree oil. Unlike commercial soaps that contain harsh chemicals, our soaps are gentle, moisturizing, and provide therapeutic benefits for your skin.'
    },
    {
      category: 'products',
      question: 'Are your soaps suitable for all skin types?',
      answer: 'Yes! Our moringa and tea tree oil soaps are formulated to be gentle yet effective for all skin types. However, we recommend patch testing if you have very sensitive skin or known allergies.'
    },
    {
      category: 'ingredients',
      question: 'What are the main ingredients in your soaps?',
      answer: 'Our primary ingredients are moringa leaves (rich in vitamins A, C, and E) and tea tree oil (natural antibacterial properties). We also use natural oils, glycerin, and other organic ingredients. All our soaps are free from sulfates, parabens, and artificial fragrances.'
    },
    {
      category: 'ingredients',
      question: 'Are your products tested on animals?',
      answer: 'Absolutely not! MoringaCare is completely cruelty-free. We never test our products on animals and only use ethically sourced, natural ingredients.'
    },
    {
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'We offer free shipping across Pakistan. Delivery typically takes 2-3 business days for major cities, 3-4 days for other cities, and 4-5 days for remote areas. You\'ll receive tracking information once your order ships.'
    },
    {
      category: 'orders',
      question: 'Do you offer Cash on Delivery (COD)?',
      answer: 'Yes! We accept Cash on Delivery, Easypaisa, and JazzCash payments. For mobile payments, you\'ll need to send a payment screenshot via WhatsApp after placing your order.'
    },
    {
      category: 'orders',
      question: 'Can I track my order?',
      answer: 'Yes, you can track your order using the order number we provide. Visit our "Track Order" page or contact us via WhatsApp for real-time updates on your shipment.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day money-back guarantee on unopened products. If you\'re not satisfied, contact us within 30 days of delivery for a full refund or exchange. Products must be in original condition and packaging.'
    },
    {
      category: 'returns',
      question: 'Can I return opened soap products?',
      answer: 'For hygiene reasons, we cannot accept returns of opened or used soap products unless there was a manufacturing defect or we sent the wrong item. However, we stand behind our quality and will work with you to resolve any issues.'
    },
    {
      category: 'usage',
      question: 'How often should I use natural soap?',
      answer: 'You can use our natural soaps daily. For face washing, once or twice daily is recommended. For body use, daily use is perfectly safe. Start gradually if you\'re new to natural soaps to let your skin adjust.'
    },
    {
      category: 'usage',
      question: 'How should I store my natural soaps?',
      answer: 'Store your soaps in a cool, dry place away from direct sunlight. Use a soap dish with good drainage to prevent the soap from sitting in water, which helps extend its life and maintain quality.'
    },
    {
      category: 'usage',
      question: 'Can I use tea tree oil soap on my face?',
      answer: 'Yes, our tea tree oil soap is gentle enough for facial use and is particularly beneficial for acne-prone or oily skin. However, if you have very sensitive skin, we recommend starting with our gentler moringa soap.'
    },
    {
      category: 'products',
      question: 'How long do your soaps last?',
      answer: 'With proper storage, our natural soaps have a shelf life of 12-18 months. Once opened and in use, a single bar typically lasts 4-6 weeks with daily use, depending on usage frequency and storage conditions.'
    },
    {
      category: 'orders',
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within Pakistan. We\'re working on expanding our shipping to other countries. If you\'re outside Pakistan, please contact us to discuss special arrangements.'
    },
    {
      category: 'ingredients',
      question: 'Are your soaps safe for pregnant women?',
      answer: 'Our natural soaps are made with safe, natural ingredients and are generally safe for pregnant women. However, we always recommend consulting with your healthcare provider before using any new skincare products during pregnancy.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about MoringaCare natural soaps, shipping, and more
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your search or browse different categories</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white border border-primary-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-primary-50 transition-colors duration-200 rounded-2xl"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <ChevronUp className="w-6 h-6 text-primary-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-primary-100 pt-4">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
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
              Still Have Questions?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our customer support team is here to help with any questions about our natural soaps
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
                <Mail className="mr-2" size={20} />
                Email Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;