import { createContext, useContext, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    user: auth0User,
    isLoading
  } = useAuth0();

  const login = () => {
    loginWithRedirect();
  };

  const signup = () => {
    loginWithRedirect({ screen_hint: 'signup' });
  };

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Transform Auth0 user to our User type
  const user: User | null = auth0User ? {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    firstName: auth0User.given_name || '',
    lastName: auth0User.family_name || '',
    title: ''
  } : null;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      user,
      isLoading
    }}>
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