import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { US_STATES } from '../constants/states';
import { useUserStore } from '../store/userStore';

interface NPIResponse {
  results: {
    organization_name: string;
    number: string;
    addresses: Array<{
      address_1: string;
      city: string;
      state: string;
      postal_code: string;
      telephone_number: string;
    }>;
  }[];
}

export const ProfileSetup = () => {
  const navigate = useNavigate();
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'npi'>('name');
  const [searchResults, setSearchResults] = useState<NPIResponse['results']>([]);

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
      let response;
      if (searchType === 'npi') {
        response = await apiService.lookupNPIByNumber(searchTerm);
      } else {
        response = await apiService.lookupNPIByName(searchTerm);
      }
      setSearchResults(response.results);
    } catch (error) {
      console.error('NPI lookup failed:', error);
    }
  };

  const selectPractice = (practice: NPIResponse['results'][0]) => {
    const address = practice.addresses[0];
    updateProfileSetupForm({
      practiceInfo: {
        ...practiceInfo,
        name: practice.organization_name,
        npiNumber: practice.number,
        address: address.address_1,
        phone: address.telephone_number,
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

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
              <div className="flex gap-4 mb-4">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'name' | 'npi')}
                  className="input-field"
                >
                  <option value="name">Search by Name</option>
                  <option value="npi">Search by NPI</option>
                </select>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchType === 'npi' ? 'Enter NPI Number' : 'Enter Practice Name'}
                  className="input-field flex-1"
                />
                <button
                  onClick={handleNPILookup}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Search
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => selectPractice(result)}
                  >
                    <h4 className="font-bold">{result.organization_name}</h4>
                    <p>NPI: {result.number}</p>
                    <p>{result.addresses[0].address_1}</p>
                    <p>
                      {result.addresses[0].city}, {result.addresses[0].state}{' '}
                      {result.addresses[0].postal_code}
                    </p>
                  </div>
                ))}
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
    </div>
  );
};

export default ProfileSetup; 