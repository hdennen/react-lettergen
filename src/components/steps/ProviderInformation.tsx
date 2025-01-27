import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { Search, Building2 } from 'lucide-react';
import type { Provider, Practice } from '../../types';

export const ProviderInformation: React.FC = () => {
  const { letterData, updateLetterData } = useLetterStore();
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null);
  const [practice, setPractice] = React.useState<Practice | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // Simulated API call for providers
        const response = await fetch('/api/providers');
        const data = await response.json();
        setProviders(data);
        
        // Set default provider (current user)
        const defaultProvider = data[0]; // Assuming first provider is the current user
        setSelectedProvider(defaultProvider);
        updateLetterData({ provider: defaultProvider });
        
        // Fetch associated practice
        if (defaultProvider) {
          const practiceResponse = await fetch(`/api/practices/${defaultProvider.practiceId}`);
          const practiceData = await practiceResponse.json();
          setPractice(practiceData);
          updateLetterData({ practice: practiceData });
        }
      } catch (error) {
        console.error('Error fetching provider data:', error);
        // Fallback data for demo
        const mockProvider = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          title: 'MD',
          npi: '1234567890',
          practiceId: '1'
        };
        const mockPractice = {
          id: '1',
          name: 'Medical Center',
          address: '123 Healthcare Ave',
          city: 'Medical City',
          state: 'MC',
          zip: '12345',
          phone: '(555) 123-4567',
          logo: 'https://example.com/logo.png'
        };
        setProviders([mockProvider]);
        setSelectedProvider(mockProvider);
        setPractice(mockPractice);
        updateLetterData({ 
          provider: mockProvider,
          practice: mockPractice
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [updateLetterData]);

  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider);
    updateLetterData({ provider });

    try {
      const response = await fetch(`/api/practices/${provider.practiceId}`);
      const practiceData = await response.json();
      setPractice(practiceData);
      updateLetterData({ practice: practiceData });
    } catch (error) {
      console.error('Error fetching practice data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">Provider Information</h2>
        <p className="text-sm text-gray-500">
          Select your provider information or search for another provider
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={selectedProvider?.id || ''}
          onChange={(e) => {
            const provider = providers.find(p => p.id === e.target.value);
            if (provider) handleProviderSelect(provider);
          }}
          className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.title} {provider.firstName} {provider.lastName} - NPI: {provider.npi}
            </option>
          ))}
        </select>
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
                  <p className="mt-1 text-sm text-gray-900">{selectedProvider.npi}</p>
                </div>
              </div>
            </div>

            {practice && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};