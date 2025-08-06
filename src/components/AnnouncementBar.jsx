import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 1 && autoSlide) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length, autoSlide]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axiosInstance.get('/api/announcements?limit=10&status=active');
      if (response.data.success && response.data.announcements) {
        const activeAnnouncements = response.data.announcements.filter(ann => {
          const now = new Date();
          const startDate = new Date(ann.startDate);
          const endDate = ann.endDate ? new Date(ann.endDate) : null;
          
          return ann.isActive && 
                 startDate <= now && 
                 (!endDate || endDate >= now);
        });
        setAnnouncements(activeAnnouncements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (announcements.length > 0) {
      announcements.forEach(ann => {
        localStorage.setItem(`announcement_closed_${ann._id}`, 'true');
      });
    }
  };

  const handlePrevious = () => {
    setAutoSlide(false);
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const handleNext = () => {
    setAutoSlide(false);
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  useEffect(() => {
    if (announcements.length > 0) {
      const allClosed = announcements.every(ann => 
        localStorage.getItem(`announcement_closed_${ann._id}`)
      );
      if (allClosed) {
        setIsVisible(false);
      }
    }
  }, [announcements]);

  if (loading || announcements.length === 0 || !isVisible) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0, y: -50 }}
        animate={{ height: 'auto', opacity: 1, y: 0 }}
        exit={{ height: 0, opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white relative overflow-hidden shadow-lg"
      >
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Previous Button */}
            {announcements.length > 1 && (
              <button
                onClick={handlePrevious}
                className="flex-shrink-0 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                aria-label="Previous announcement"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="flex items-center justify-center flex-1">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex-shrink-0 mr-4"
              >
                <Megaphone className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div
                key={currentIndex}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.p
                  animate={{ 
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 10px rgba(255,255,255,0.3)',
                      '0 0 0px rgba(255,255,255,0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg font-semibold"
                >
                  {currentAnnouncement.message}
                </motion.p>
              </motion.div>
            </div>
            
            {/* Next Button */}
            {announcements.length > 1 && (
              <button
                onClick={handleNext}
                className="flex-shrink-0 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                aria-label="Next announcement"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 90,
                backgroundColor: 'rgba(255,255,255,0.2)'
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onClick={handleClose}
              className="flex-shrink-0 ml-4 p-2 rounded-full transition-all duration-300 hover:bg-white hover:bg-opacity-20"
              aria-label="Close announcement"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Dots indicator for multiple announcements */}
          {announcements.length > 1 && (
            <div className="flex justify-center pb-2">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoSlide(false);
                    setTimeout(() => setAutoSlide(true), 10000);
                  }}
                  className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <motion.div
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBar;