import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Home, 
  Heart, 
  BookOpen, 
  User, 
  Mail, 
  LogIn,
  PlusCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close sidebar when escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Menu links array for easy modification
  const menuLinks = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/vitamins', label: 'All Vitamins', icon: <BookOpen size={20} /> },
    { to: '/about', label: 'About Me', icon: <User size={20} /> },
  ];

  // Admin/Auth links
  const authLinks = [
    { to: '/login', label: 'Sign In', icon: <LogIn size={20} /> },
    { to: '/manage-vitamins', label: 'Manage Vitamins', icon: <PlusCircle size={20} /> },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[80vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-red-600">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Main Menu */}
        <nav className="p-6 overflow-y-auto h-[calc(100%-140px)]">
          <ul className="space-y-1">
            {menuLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className="flex items-center p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 group transition-colors"
                  onClick={onClose}
                >
                  <span className="mr-3 text-gray-500 group-hover:text-red-500">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />
          
          {/* Auth Links */}
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold px-3 mb-2">Account</h3>
            <ul className="space-y-1">
              {authLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 group transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3 text-gray-500 group-hover:text-red-500">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="font-semibold text-gray-800 mb-1">Spiritual Vitamins</div>
            <div className="text-sm text-gray-500">Nourishing your soul daily</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;