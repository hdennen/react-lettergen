import React, { createContext, useContext, useState, ReactNode } from 'react';
import { config } from '../config';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication
    setIsAuthenticated(true);
    // Store token or user data in localStorage
    localStorage.setItem('isAuthenticated', 'true');
  };

  const signup = async (email: string, password: string): Promise<User> => {
    // TODO: Implement actual signup
    await login(email, password);
    if (config.useMockData) {
      console.info('Using mock data for signup');
      return Promise.resolve({
        id: '123',
        email: email,
        firstName: '',
        lastName: '',
        title: ''
      });
    }

    try {
      const user = await apiService.signup(email, password);
      return user;
    } catch (error) {
      console.error('Failed to signup:', error);
      throw error;
    }
    
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 