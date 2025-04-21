// src/components/Auth.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const location = useLocation();
  const navigate = useNavigate();

  // Set initial mode based on the current route
  useEffect(() => {
    if (location.pathname === '/signup') {
      setAuthMode('signup');
    } else {
      setAuthMode('signin');
    }
  }, [location.pathname]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // Standard signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Manually confirm the user in Supabase
      // Note: This requires proper configuration in your Supabase project
      // You may need to disable email confirmation in your Supabase Auth settings
      
      alert('Account created successfully! You can now log in.');
      // Reset fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Switch to login mode
      setAuthMode('signin');
    } catch (error) {
      alert('Error during signup: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Check if this is an email confirmation error
        if (error.message.includes('Email not confirmed')) {
          // Try to manually confirm the user
          await handleManualConfirmation();
        } else {
          throw error;
        }
      } else {
        // Login successful
        alert('Login successful!');
        navigate('/'); // Redirect to home page
      }
    } catch (error) {
      alert('Error signing in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle manual confirmation as a workaround
  const handleManualConfirmation = async () => {
    try {
      alert("Your email wasn't confirmed yet. Please check your email for a confirmation link or try signing up again.");
      
      // Alternative approach: Use admin functions to confirm the user
      // This requires server-side code or Supabase Functions
      // Not implemented here as it requires backend access
    } catch (error) {
      console.error('Manual confirmation failed:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {authMode === 'signin' ? 'Login' : 'Create Account'}
        </h2>
        
        <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="your@email.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="Your password"
            />
            {authMode === 'signup' && (
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
          
          {authMode === 'signup' && (
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : authMode === 'signin' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
              // Reset form fields when switching modes
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            {authMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;