import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { epicService } from '../services/epicService';
import { US_STATES } from '../constants/states';
import { useUserStore } from '../store/userStore';
import { AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react';

interface NPIResponse {
  results: Array<{
    organization_name?: string;
    basic?: {
      first_name?: string;
      last_name?: string;
      credential?: string;
    };
    number: string;
    addresses: Array<{
      address_1: string;
      city: string;
      state: string;
      postal_code: string;
      telephone_number: string;
    }>;
  }>;
}

export const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'organization' | 'provider' | 'npi'>('organization');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResults, setSearchResults] = useState<NPIResponse['results']>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEpicConnected, setIsEpicConnected] = useState(false);
  const [isCheckingEpicConnection, setIsCheckingEpicConnection] = useState(true);
  const [epicConnectionMessage, setEpicConnectionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { 
    currentUser,
    profileSetupForm,
    updateProfileSetupForm,
    saveCompleteProfile,
    isLoading,
    error
  } = useUserStore();

  // Destructure form state from store for easier access
  const { personalInfo, practiceInfo } = profileSetupForm;

  // Check Epic connection status on component mount
  useEffect(() => {
    const checkEpicConnection = async () => {
      try {
        const isConnected = await epicService.isConnectedToEpic();
        setIsEpicConnected(isConnected);
      } catch (error) {
        console.error('Error checking Epic connection:', error);
      } finally {
        setIsCheckingEpicConnection(false);
      }
    };

    checkEpicConnection();
  }, []);

  // Check for Epic connection success message from callback
  useEffect(() => {
    if (location.state && location.state.epicConnected) {
      setEpicConnectionMessage({
        type: 'success',
        text: location.state.message || 'Successfully connected to Epic!'
      });
      setIsEpicConnected(true);
      
      // Clear the location state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Pre-fill form with current user data if available
  useEffect(() => {
    if (currentUser && currentUser.firstName) {
      updateProfileSetupForm({
        personalInfo: {
          ...personalInfo,
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          title: currentUser.title || '',
          npiNumber: currentUser.npiNumber || '',
        }
      });
    }
  }, [currentUser]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateProfileSetupForm({
      personalInfo: {
        ...personalInfo,
        [name]: type === 'checkbox' ? checked : value,
      }
    });
  };

  const handlePracticeInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateProfileSetupForm({
      practiceInfo: {
        ...practiceInfo,
        [name]: value,
      }
    });
  };

  const handleNPILookup = async () => {
    try {
      setSearchResults([]);
      
      if (searchType === 'npi' && !searchTerm.trim()) {
        return;
      }
      
      if (searchType === 'provider' && (!firstName.trim() || !lastName.trim())) {
        alert('Please enter both first and last name for provider search.');
        return;
      }
      
      if (searchType === 'organization' && !searchTerm.trim()) {
        return;
      }
      
      setIsSearching(true);
      
      let response;
      if (searchType === 'npi') {
        response = await apiService.lookupNPIByNumber(searchTerm);
      } else if (searchType === 'provider') {
        response = await apiService.lookupNPIByProviderName(firstName, lastName);
      } else {
        response = await apiService.lookupNPIByName(searchTerm);
      }
      
      if (response && response.results && response.results.length > 0) {
        setSearchResults(response.results);
      } else {
        // Show a message that no results were found
        alert('No results found. Please try a different search term.');
      }
    } catch (error) {
      console.error('NPI lookup failed:', error);
      alert('Error looking up NPI. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectPractice = (practice: NPIResponse['results'][0]) => {
    const address = practice.addresses[0];
    
    // Determine the name based on whether it's an organization or individual
    const name = practice.organization_name || 
      (practice.basic ? `${practice.basic.first_name} ${practice.basic.last_name}` : 'Unknown');
    
    updateProfileSetupForm({
      practiceInfo: {
        ...practiceInfo,
        name: name,
        npiNumber: practice.number,
        address: address.address_1,
        phone: address.telephone_number || '',
        city: address.city,
        state: address.state,
        zip: address.postal_code,
      }
    });
    setShowLookupModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the store action to save the complete profile
      await saveCompleteProfile();
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleConnectWithEpic = async () => {
    try {
      await epicService.initiateEpicAuth();
    } catch (error) {
      console.error('Error connecting to Epic:', error);
      setEpicConnectionMessage({
        type: 'error',
        text: 'Failed to connect to Epic. Please try again.'
      });
    }
  };

  const handleDisconnectFromEpic = async () => {
    try {
      await epicService.disconnectFromEpic();
      setIsEpicConnected(false);
      setEpicConnectionMessage({
        type: 'success',
        text: 'Successfully disconnected from Epic.'
      });
    } catch (error) {
      console.error('Error disconnecting from Epic:', error);
      setEpicConnectionMessage({
        type: 'error',
        text: 'Failed to disconnect from Epic. Please try again.'
      });
    }
  };

  const renderEpicConnectionSection = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <LinkIcon className="mr-2 h-5 w-5 text-blue-600" />
          Epic Integration
        </h2>
        
        {epicConnectionMessage && (
          <div className={`mb-4 p-3 rounded-md ${epicConnectionMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {epicConnectionMessage.type === 'success' ? (
              <CheckCircle2 className="inline-block mr-2 h-5 w-5" />
            ) : (
              <AlertCircle className="inline-block mr-2 h-5 w-5" />
            )}
            {epicConnectionMessage.text}
          </div>
        )}
        
        {isCheckingEpicConnection ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Checking connection status...</span>
          </div>
        ) : isEpicConnected ? (
          <div>
            <div className="flex items-center mb-4 text-green-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>Connected to Epic</span>
            </div>
            <button
              type="button"
              onClick={handleDisconnectFromEpic}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Disconnect from Epic
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">
              Connect your account with Epic to streamline your workflow and access patient data directly.
            </p>
            <button
              type="button"
              onClick={handleConnectWithEpic}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <LinkIcon className="mr-2 h-5 w-5" />
              Connect with Epic
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      
      {/* Epic Connection Section */}
      {renderEpicConnectionSection()}
      
      {/* Rest of the form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={personalInfo.firstName}
              onChange={handlePersonalInfoChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={personalInfo.lastName}
              onChange={handlePersonalInfoChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={personalInfo.title}
              onChange={handlePersonalInfoChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="npiNumber"
              placeholder="NPI Number"
              value={personalInfo.npiNumber}
              onChange={handlePersonalInfoChange}
              className="input-field"
              required
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="attestation"
                checked={personalInfo.attestation}
                onChange={handlePersonalInfoChange}
                className="mr-2"
                required
              />
              <span className="text-sm">
                I attest that I am a healthcare professional seeking an account for my own use.
              </span>
            </label>
          </div>
        </div>

        {/* Practice Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Practice Information</h3>
          <button
            type="button"
            onClick={() => setShowLookupModal(true)}
            className="mb-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Practice Information Lookup
          </button>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Practice Name"
              value={practiceInfo.name}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="npiNumber"
              placeholder="Practice NPI Number"
              value={practiceInfo.npiNumber}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Practice Address"
              value={practiceInfo.address}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Practice Phone Number"
              value={practiceInfo.phone}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Practice City"
              value={practiceInfo.city}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            />
            <select
              name="state"
              value={practiceInfo.state}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            >
              <option value="">Select State</option>
              {US_STATES.map(state => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="zip"
              placeholder="Practice ZIP Code"
              value={practiceInfo.zip}
              onChange={handlePracticeInfoChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md ${
            isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* NPI Lookup Modal */}
      {showLookupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Practice Lookup</h3>
            <div className="mb-4">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'organization' | 'provider' | 'npi')}
                className="input-field w-full mb-4"
                disabled={isSearching}
              >
                <option value="organization">Search by Organization Name</option>
                <option value="provider">Search by Provider Name</option>
                <option value="npi">Search by NPI Number</option>
              </select>
              
              {searchType === 'provider' ? (
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="input-field flex-1"
                    disabled={isSearching}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="input-field flex-1"
                    disabled={isSearching}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchType === 'npi' ? 'Enter NPI Number' : 'Enter Organization Name'}
                  className="input-field w-full"
                  disabled={isSearching}
                />
              )}
            </div>
            
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNPILookup}
                className={`${isSearching ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-md flex items-center justify-center min-w-[100px]`}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : 'Search'}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600">Searching NPI Registry...</p>
                </div>
              ) : (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => selectPractice(result)}
                  >
                    <h4 className="font-bold">
                      {result.organization_name || 
                        (result.basic ? `${result.basic.first_name} ${result.basic.last_name}${result.basic.credential ? `, ${result.basic.credential}` : ''}` : 'Unknown')}
                    </h4>
                    <p>NPI: {result.number}</p>
                    <p>{result.addresses[0].address_1}</p>
                    <p>
                      {result.addresses[0].city}, {result.addresses[0].state}{' '}
                      {result.addresses[0].postal_code}
                    </p>
                    {result.addresses[0].telephone_number && (
                      <p>Phone: {result.addresses[0].telephone_number}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowLookupModal(false)}
              className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSetup; 