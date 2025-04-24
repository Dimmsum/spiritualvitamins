import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer navigation links
  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { to: '/', label: 'Home' },
        { to: '/vitamins', label: 'All Vitamins' },
        { to: '/categories', label: 'Categories' },
        { to: '/about', label: 'About Us' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { to: '/testimonials', label: 'Testimonials' },
        { to: '/faq', label: 'FAQ' },
        { to: '/privacy', label: 'Privacy Policy' },
        { to: '/terms', label: 'Terms of Service' }
      ]
    },
    {
      title: 'Connect',
      links: [
        { to: '/contact', label: 'Contact Us' },
        { to: '/subscribe', label: 'Subscribe' },
        { to: '/donate', label: 'Support Our Ministry' },
        { to: '/share', label: 'Share Your Story' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Top section with logo and social links */}
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Spiritual Vitamins</h2>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              Daily doses of spiritual wisdom and inspiration to nourish your soul and strengthen your faith.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="mailto:contact@spiritualvitamins.com" 
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Get Daily Spiritual Vitamins</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter and receive daily inspiration.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-red-500"
                required
              />
              <button 
                type="submit" 
                className="px-5 py-2 bg-red-600 text-white font-medium rounded-r-md hover:bg-red-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer links section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 pb-8 border-b border-gray-800">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.to}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Copyright and bottom text */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Spiritual Vitamins by Flawless Lee. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> in faith and love
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;