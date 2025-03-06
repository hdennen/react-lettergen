import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, X } from 'lucide-react';

export const ProfileNotification: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);
  const { currentUser, fetchUserAndOrganization } = useUserStore();
  const { isAuthenticated, getAccessToken } = useAuth();
  
  // Check if profile is incomplete (missing required fields)
  const isProfileIncomplete = 
    isAuthenticated && 
    currentUser && 
    (!currentUser.firstName || 
     !currentUser.lastName || 
     !currentUser.title || 
     !currentUser.npiNumber);

  // First, ensure the token is set in the API service
  useEffect(() => {
    if (isAuthenticated) {
      const prepareToken = async () => {
        try {
          await getAccessToken(); // This will set the token in the API service
          setTokenReady(true);
        } catch (error) {
          console.error('Error preparing token:', error);
        }
      };
      
      prepareToken();
    }
  }, [isAuthenticated, getAccessToken]);

  // Then fetch user data once the token is ready
  useEffect(() => {
    if (isAuthenticated && tokenReady) {
      fetchUserAndOrganization().catch(console.error);
    }
  }, [isAuthenticated, tokenReady, fetchUserAndOrganization]);

  if (!isAuthenticated || !isProfileIncomplete || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-400 mr-3" />
          <div>
            <p className="text-sm text-amber-700">
              Your profile is incomplete. 
              <Link to="/profile/setup" className="ml-2 font-medium underline">
                Complete your profile
              </Link>
            </p>
          </div>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}; 