import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, X } from 'lucide-react';

export const ProfileNotification: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { currentUser, fetchUserAndOrganization } = useUserStore();
  const { isAuthenticated } = useAuth();
  
  // Check if profile is incomplete (missing required fields)
  const isProfileIncomplete = 
    isAuthenticated && 
    currentUser && 
    (!currentUser.firstName || 
     !currentUser.lastName || 
     !currentUser.title || 
     !currentUser.npiNumber);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserAndOrganization().catch(console.error);
    }
  }, [isAuthenticated, fetchUserAndOrganization]);

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