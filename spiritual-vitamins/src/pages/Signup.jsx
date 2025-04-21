// src/pages/Signup.jsx
import React, { useEffect } from 'react';
import Auth from '../components/Auth';
import Header from '../components/Header';

const Signup = () => {
  // Set the Auth component to signup mode initially
  useEffect(() => {
    // We'll modify the Auth component to accept an initialMode prop
    // This is a simple way to communicate with the component
    const authElement = document.querySelector('form');
    if (authElement) {
      // Trigger a click on the mode switch button to change to signup
      const modeSwitchButton = document.querySelector('button[class*="text-red-500"]');
      if (modeSwitchButton && modeSwitchButton.textContent.includes("Don't have an account")) {
        modeSwitchButton.click();
      }
    }
  }, []);

  return (
    <>
      <Header />
        <Auth />
      
    </>
  );
};

export default Signup;