import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Leaf, Sun, Moon, Heart, Sparkles, Info, CheckCircle, Star } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const SoapGuidePage = () => {
  const [activeTab, setActiveTab] = useState('skin-types');

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Soap Guide', path: '/soap-guide' }
  ];

  const skinTypes = [
    {
      type: 'Dry Skin',
      icon: Droplets,
      description: 'Lacks moisture and may feel tight or flaky',
      recommendations: [
        'Use moisturizing moringa soap with natural oils',
        'Avoid harsh scrubbing',
        'Apply moisturizer immediately after washing',
        'Use lukewarm water instead of hot'
      ],
      products: ['Moringa Moisturizing Soap', 'Tea Tree Oil Gentle Soap'],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'Oily Skin',
      icon: Sun,
      description: 'Produces excess oil, especially in T-zone',
      recommendations: [
        'Use tea tree oil soap for oil control',
        'Wash twice daily with gentle soap',
        'Don\'t over-wash as it can increase oil production',
        'Use oil-free moisturizer'
      ],
      products: ['Tea Tree Oil Clarifying Soap', 'Moringa Deep Cleanse Soap'],
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      type: 'Combination Skin',
      icon: Heart,
      description: 'Oily T-zone with normal to dry cheeks',
      recommendations: [
        'Use balanced moringa soap for overall care',
        'Focus tea tree oil soap on oily areas',
        'Moisturize dry areas more',
        'Use different products for different areas if needed'
      ],
      products: ['Moringa Balanced Soap', 'Tea Tree Oil Targeted Soap'],
      color: 'bg-purple-100 text-purple-600'
    },
    {
      type: 'Sensitive Skin',
      icon: Leaf,
      description: 'Easily irritated, may react to harsh ingredients',
      recommendations: [
        'Use gentle moringa soap with natural ingredients',
        'Patch test new products first',
        'Avoid fragranced soaps',
        'Use minimal, gentle pressure when washing'
      ],
      products: ['Moringa Gentle Soap', 'Natural Unscented Soap'],
      color: 'bg-green-100 text-green-600'
    }
  ];

  const soapBenefits = [
    {
      ingredient: 'Moringa',
      benefits: [
        'Rich in vitamins A, C, and E',
        'Natural antioxidant properties',
        'Helps cleanse and purify skin',
        'Moisturizes without clogging pores',
        'Anti-aging properties'
      ],
      icon: Leaf,
      color: 'bg-green-500'
    },
    {
      ingredient: 'Tea Tree Oil',
      benefits: [
        'Natural antibacterial properties',
        'Helps control acne and breakouts',
        'Reduces inflammation',
        'Balances oil production',
        'Soothes irritated skin'
      ],
      icon: Droplets,
      color: 'bg-blue-500'
    }
  ];

  const usageTips = [
    {
      title: 'Morning Routine',
      icon: Sun,
      tips: [
        'Use lukewarm water to wet your face',
        'Apply soap gently in circular motions',
        'Rinse thoroughly with cool water',
        'Pat dry with a clean towel',
        'Apply moisturizer while skin is still damp'
      ]
    },
    {
      title: 'Evening Routine',
      icon: Moon,
      tips: [
        'Remove makeup first if applicable',
        'Use soap to cleanse away daily impurities',
        'Massage gently for 30-60 seconds',
        'Rinse with lukewarm water',
        'Apply night moisturizer or serum'
      ]
    }
  ];

  const tabs = [
    { id: 'skin-types', label: 'Skin Types', icon: Heart },
    { id: 'ingredients', label: 'Ingredients', icon: Leaf },
    { id: 'usage', label: 'Usage Tips', icon: Sparkles }
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
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Natural Soap Guide
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about choosing and using MoringaCare natural soaps for healthy skin
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'skin-types' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Choose the Right Soap for Your Skin Type
                </h2>
                <p className="text-lg text-gray-600">
                  Understanding your skin type helps you select the perfect MoringaCare soap
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {skinTypes.map((skinType, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-primary-100"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${skinType.color} rounded-2xl mb-6`}>
                      <skinType.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{skinType.type}</h3>
                    <p className="text-gray-600 mb-6">{skinType.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Care:</h4>
                      <ul className="space-y-2">
                        {skinType.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Products:</h4>
                      <div className="space-y-2">
                        {skinType.products.map((product, prodIndex) => (
                          <div key={prodIndex} className="bg-primary-50 px-3 py-2 rounded-lg">
                            <span className="text-primary-700 font-medium text-sm">{product}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ingredients' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Natural Ingredients & Their Benefits
                </h2>
                <p className="text-lg text-gray-600">
                  Discover the power of nature in every MoringaCare soap
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {soapBenefits.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-primary-100"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${ingredient.color} rounded-2xl mb-6`}>
                      <ingredient.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{ingredient.ingredient}</h3>
                    <ul className="space-y-4">
                      {ingredient.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'usage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  How to Use Natural Soaps
                </h2>
                <p className="text-lg text-gray-600">
                  Get the most out of your MoringaCare soaps with these expert tips
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {usageTips.map((routine, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-primary-100"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <routine.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{routine.title}</h3>
                    </div>
                    <ol className="space-y-3">
                      {routine.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary-600 font-bold text-sm">{tipIndex + 1}</span>
                          </div>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                ))}
              </div>

              {/* Additional Tips */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Info className="w-8 h-8 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900">Pro Tips for Best Results</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Storage Tips:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Keep soaps in a dry, well-ventilated area</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Use a soap dish with drainage</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Avoid direct sunlight and humidity</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Usage Tips:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Start with small amounts and build up</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Be gentle - natural soaps are concentrated</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Allow 2-4 weeks to see full benefits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Natural Soap Journey?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Browse our collection of premium natural soaps and find the perfect match for your skin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Shop Natural Soaps
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Get Personal Advice
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SoapGuidePage;