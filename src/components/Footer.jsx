import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo size="md" variant="default" />
            </div>
            <p className="text-gray-600 text-sm">
              World's finest moringa and tea tree oil soaps. Enhance your beauty with Eleve's premium handcrafted natural soap collection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Moringa & Tea Tree Soaps
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping-info" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns-exchanges" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/soap-guide" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Soap Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-600" />
                <span className="text-gray-600 text-sm">+92-300-1234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-600" />
                <span className="text-gray-600 text-sm">info@moringacare.pk</span>
                <span className="text-gray-600 text-sm">info@eleve.pk</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary-600 mt-1" />
                <span className="text-gray-600 text-sm">
                  info@eleve.pk
                  Mardan, Pakistan
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Eleve. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart size={16} className="text-primary-600 mx-1" /> for natural skincare enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  )
}