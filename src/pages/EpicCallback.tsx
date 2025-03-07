import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { epicService } from '../services/epicService';
import { Loader2 } from 'lucide-react';

export const EpicCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the URL search params to get the code and state
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code || !state) {
          setError('Missing required parameters from Epic');
          setIsProcessing(false);
          return;
        }
        
        // Process the callback with the backend
        await epicService.handleEpicCallback(code, state);
        
        // Redirect to profile page with success message
        navigate('/profile/setup', { 
          state: { 
            epicConnected: true,
            message: 'Successfully connected to Epic!' 
          } 
        });
      } catch (error) {
        console.error('Error processing Epic callback:', error);
        setError('Failed to complete Epic connection. Please try again.');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/profile/setup')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connecting to Epic</h1>
        <p className="text-gray-600">Please wait while we complete your Epic connection...</p>
      </div>
    </div>
  );
}; 