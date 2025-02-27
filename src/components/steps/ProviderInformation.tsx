import React, { useState, useEffect } from 'react';
import { useLetterStore } from '../../store/letterStore';
import { Building2, User, AlertCircle } from 'lucide-react';
import type { UserProfile } from '../../types';
import type { Practice } from '../../types/index';
import { useUserStore } from '../../store/userStore';
import { Link } from 'react-router-dom';

export const ProviderInformation: React.FC = () => {
  const { updateLetterData, letterData } = useLetterStore();
  const { 
    practice, 
    practiceProviders, 
    currentUser, 
    fetchUserAndPractice,
    isLoading 
  } = useUserStore();
  
  const [selectedProvider, setSelectedProvider] = useState<UserProfile | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualProviderData, setManualProviderData] = useState({
    title: letterData?.provider?.title || '',
    firstName: letterData?.provider?.firstName || '',
    lastName: letterData?.provider?.lastName || '',
    npiNumber: letterData?.provider?.npiNumber || '',
  });
  const [manualPracticeData, setManualPracticeData] = useState({
    name: letterData?.practice?.name || '',
    address: letterData?.practice?.address || '',
    city: letterData?.practice?.city || '',
    state: letterData?.practice?.state || '',
    zip: letterData?.practice?.zip || '',
    phone: letterData?.practice?.phone || '',
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserAndPractice();
      } catch (error) {
        console.error('Error fetching provider data:', error);
        // Switch to manual entry if there's an error
        setManualEntry(true);
      }
    };

    if (!practice || !practiceProviders.length) {
      loadData();
    } else if (currentUser && !selectedProvider) {
      // Set current user as default provider
      setSelectedProvider(currentUser);
      updateLetterData({ 
        provider: currentUser,
        practice 
      });
    }
  }, [currentUser, practice, practiceProviders, fetchUserAndPractice, selectedProvider, updateLetterData]);

  const handleProviderSelect = (provider: UserProfile) => {
    setSelectedProvider(provider);
    updateLetterData({ 
      provider,
      practice 
    });
  };

  const handleManualProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualProviderData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleManualPracticeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualPracticeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleManualSubmit = () => {
    const manualProvider = {
      id: currentUser?.id || 'manual',
      email: currentUser?.email || '',
      ...manualProviderData,
      practiceId: practice?.id || 'manual',
    } as UserProfile;

    const manualPractice = {
      id: practice?.id || 'manual',
      ...manualPracticeData,
      npiNumber: manualProviderData.npiNumber,
      providers: [],
      logo: ''
    } as Practice;

    updateLetterData({
      provider: manualProvider,
      practice: manualPractice,
    });
  };

  useEffect(() => {
    // Update letter data when manual fields change
    if (manualEntry) {
      handleManualSubmit();
    }
  }, [manualProviderData, manualPracticeData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if ((!practice || !currentUser || !currentUser.firstName) && !manualEntry) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-3" />
            <div>
              <p className="text-sm text-amber-700">
                Your profile information is incomplete. You can 
                <Link to="/profile/setup" className="text-amber-700 font-medium underline mx-1">
                  complete your profile
                </Link>
                or continue with manual entry.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setManualEntry(true)}
          className="w-full bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50"
        >
          Continue with Manual Entry
        </button>
      </div>
    );
  }

  if (manualEntry) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Provider Information</h2>
          <p className="text-sm text-gray-500">
            Enter your provider and practice details
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Provider Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={manualProviderData.title}
                    onChange={handleManualProviderChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="MD, DO, NP, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={manualProviderData.firstName}
                    onChange={handleManualProviderChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={manualProviderData.lastName}
                    onChange={handleManualProviderChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NPI Number</label>
                  <input
                    type="text"
                    name="npiNumber"
                    value={manualProviderData.npiNumber}
                    onChange={handleManualProviderChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Practice Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Practice Name</label>
                  <input
                    type="text"
                    name="name"
                    value={manualPracticeData.name}
                    onChange={handleManualPracticeChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={manualPracticeData.address}
                    onChange={handleManualPracticeChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={manualPracticeData.city}
                      onChange={handleManualPracticeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={manualPracticeData.state}
                      onChange={handleManualPracticeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      maxLength={2}
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP</label>
                    <input
                      type="text"
                      name="zip"
                      value={manualPracticeData.zip}
                      onChange={handleManualPracticeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={manualPracticeData.phone}
                    onChange={handleManualPracticeChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">Provider Information</h2>
        <p className="text-sm text-gray-500">
          Select your provider information or another provider from your practice
        </p>
        <button
          onClick={() => setManualEntry(true)}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Switch to Manual Entry
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={selectedProvider?.id || ''}
          onChange={(e) => {
            const provider = practiceProviders.find(p => p.id === e.target.value);
            if (provider) handleProviderSelect(provider);
          }}
          className="block w-full pl-10 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer pr-10"
        >
          <option value="" disabled>Select a provider</option>
          {practiceProviders.map((provider) => (
            <option 
              key={provider.id} 
              value={provider.id}
              className="py-2"
            >
              {provider.title} {provider.firstName} {provider.lastName} - NPI: {provider.npiNumber}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>

      {selectedProvider && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Provider Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProvider.title} {selectedProvider.firstName} {selectedProvider.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NPI</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProvider.npiNumber}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Practice Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Practice Name</label>
                  <p className="mt-1 text-sm text-gray-900">{practice.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {practice.address}<br />
                    {practice.city}, {practice.state} {practice.zip}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{practice.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};