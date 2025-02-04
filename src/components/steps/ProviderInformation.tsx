import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { Building2, User } from 'lucide-react';
import type { UserProfile, Practice } from '../../types';
import { useUserStore } from '../../store/userStore';

export const ProviderInformation: React.FC = () => {
  const { updateLetterData } = useLetterStore();
  const { 
    practice, 
    practiceProviders, 
    currentUser, 
    fetchUserAndPractice,
    isLoading 
  } = useUserStore();
  const [selectedProvider, setSelectedProvider] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserAndPractice();
      } catch (error) {
        console.error('Error fetching provider data:', error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!practice || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No practice information available</p>
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