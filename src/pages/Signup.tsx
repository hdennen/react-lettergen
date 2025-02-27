import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserStore } from '../store/userStore';

export const Signup = () => {
  const [error, setError] = useState('');
  const { signup, user, isAuthenticated } = useAuth();
  const { setCurrentUser } = useUserStore();
  const navigate = useNavigate();

  // Effect to handle user data after successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        title: user.title || '',
        npiNumber: '',
        practiceId: '',
      });
      
      // Redirect to home page
      navigate('/');
    }
  }, [isAuthenticated, user, setCurrentUser, navigate]);

  const handleSignup = () => {
    try {
      // Auth0 handles the signup and redirect
      signup();
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          <div>
            <button
              onClick={handleSignup}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up with Auth0
            </button>
          </div>
        </div>
        <div className="text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}; 