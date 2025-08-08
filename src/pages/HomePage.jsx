import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Shield, Truck, Heart, ArrowRight, Sparkles, Award, Users, Leaf, CheckCircle, Play } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/products?featured=true&limit=4');
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const features = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "Pure moringa leaves and tea tree oil, no harmful chemicals",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Heart,
      title: "Handcrafted",
      description: "Each soap is lovingly handmade in small batches",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Complimentary delivery across Pakistan",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "30-day money-back guarantee on all products",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Ayesha Khan",
      location: "Karachi",
      rating: 5,
      comment: "AM Botonics moringa soap completely transformed my skin! The quality is unmatched - best moringa soap I've ever used.",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Fatima Ali",
      location: "Lahore", 
      rating: 5,
      comment: "AM Botonics has the best moringa and tea tree oil soaps! My skin feels incredibly soft and healthy. Highly recommend!",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Sara Ahmed",
      location: "Islamabad",
      rating: 5,
      comment: "AM Botonics tea tree oil soap is amazing for acne-prone skin. The moringa benefits are incredible - my skin glows now!",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers", icon: Users },
    { number: "15+", label: "Soap Varieties", icon: Leaf },
    { number: "3", label: "Years Excellence", icon: Award },
    { number: "99.8%", label: "Satisfaction Rate", icon: Heart }
  ];

  return (
    <>
      <Helmet>
        <title>Eleve - World's Best Moringa & Tea Tree Oil Soaps | Premium Natural Skincare Pakistan</title>
        <meta name="description" content="Eleve offers the world's finest moringa and tea tree oil soaps. Premium natural skincare handcrafted with pure organic ingredients. #1 moringa soap brand in Pakistan with free delivery nationwide." />
        <meta name="keywords" content="Eleve, moringa soap Pakistan, tea tree oil soap, best moringa soap, natural soap Pakistan, organic moringa products, handmade soap, premium skincare, moringa leaves soap, botanical soap, natural skincare Pakistan, buy moringa soap online, moringa soap benefits, tea tree soap benefits" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg text-primary-700 text-sm font-medium mb-8 border border-primary-100"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
                  Premium Natural Soap Collection
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-gray-900 mb-6 leading-tight">
                  World's Finest
                  <span className="block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    Moringa Soaps
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                  Experience the power of nature with Eleve's premium moringa and tea tree oil soaps. 
                  Handcrafted with pure organic ingredients for radiant, healthy skin that glows naturally.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    to="/products"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-primary-500 mr-2" />
                    <span className="font-medium">5000+ Happy Customers</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-primary-500 mr-2" />
                    <span className="font-medium">100% Pure Moringa</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Premium Natural Soap Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-primary-100"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Loved by 5000+ customers</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -top-6 -right-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-xl"
                >
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Natural</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-200 transition-colors">
                    <stat.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

    

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">
                Premium Moringa Collection
              </h2>
              <p className="text-xl text-gray-600">
                Discover Eleve's award-winning moringa and tea tree oil soap collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-primary-100"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.images?.[0]?.url || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-200 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                View All Products
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </div>
        </section>

            <section className="py-20 bg-gradient-to-b from-white to-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">
                Why Choose AM Botonics?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're the world's leading moringa soap experts, committed to providing premium natural skincare that transforms your skin
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-primary-100"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600">
                Real stories from real customers who love AM Botonics
              </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-3xl">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 md:p-12 shadow-xl border border-primary-100"
                >
                  <div className="flex items-center mb-6">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonials[activeTestimonial].comment}"
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-primary-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-gray-600">{testimonials[activeTestimonial].location}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Testimonial Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      activeTestimonial === index ? 'bg-primary-500' : 'bg-primary-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600/20 to-transparent"></div>
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
                Ready to Experience Eleve?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have discovered Eleve's world's finest moringa and tea tree oil soaps
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="group inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;