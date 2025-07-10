import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Branding */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Expense Book
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Smart, simple, and efficient expense tracking for modern life
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 ease-in-out flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/analysis" 
                  className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 ease-in-out flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Analysis
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 ease-in-out flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 hover:scale-110 transition-all duration-300 ease-in-out group"
              >
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-gray-800 rounded-full hover:bg-sky-500 hover:scale-110 transition-all duration-300 ease-in-out group"
              >
                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 hover:scale-110 transition-all duration-300 ease-in-out group"
              >
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-gray-800 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 ease-in-out group"
              >
                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Stay updated with our latest features and tips
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Expense Book. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Built with ❤️ for better financial management
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;