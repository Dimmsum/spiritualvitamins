import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  // Function to handle clicking a navigation link
  const handleNavClick = () => {
    // Close the sidebar when a link is clicked
    onClose();
  };

  return (
    <>
      {/* Invisible overlay for handling outside clicks without darkening the screen */}
      <div 
        className={`fixed inset-0 z-40 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 ">
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X size={24} color="#FF2C2C" />
          </button>
        </div>
        
        <nav className="px-4 py-6">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="block py-2 text-gray-700 hover:text-[#FF2C2C] transition-colors"
                onClick={handleNavClick}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/vitamins" 
                className="block py-2 text-gray-700 hover:text-[#FF2C2C] transition-colors"
                onClick={handleNavClick}
              >
                All Vitamins
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="block py-2 text-gray-700 hover:text-[#FF2C2C] transition-colors"
                onClick={handleNavClick}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/manage-vitamins" 
                className="block py-2 text-gray-700 hover:text-[#FF2C2C] transition-colors"
                onClick={handleNavClick}
              >
                Manage Vitamins
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="px-4 py-6 border-t mt-auto">
          <div className="space-y-3">
            <Link 
              to="/login" 
              className="block w-full py-2 text-center rounded-md border border-[#FF2C2C] text-[#FF2C2C] hover:bg-red-50 transition-colors"
              onClick={handleNavClick}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="block w-full py-2 text-center rounded-md bg-[#FF2C2C] text-white hover:bg-red-600 transition-colors"
              onClick={handleNavClick}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;