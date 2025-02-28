import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  user: User | null;
  isLoading: boolean;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    user: auth0User,
    isLoading,
    getAccessTokenSilently
  } = useAuth0();

  // Get and set the access token when authentication state changes
  useEffect(() => {
    const setToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          apiService.setAuthToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
          apiService.setAuthToken(null);
        }
      } else {
        apiService.setAuthToken(null);
      }
    };

    setToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const login = () => {
    loginWithRedirect();
  };

  const signup = () => {
    loginWithRedirect({ 
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  };

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Function to get the access token
  const getAccessToken = async (): Promise<string | null> => {
    if (!isAuthenticated) return null;
    
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
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
      isLoading,
      getAccessToken
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