export const mockData = {
  products: [
    {
      id: '1',
      name: 'Product A',
      description: 'Description for Product A',
      templates: [],
    },
    {
      id: '2',
      name: 'Product B',
      description: 'Description for Product B',
      templates: [],
    },
  ],

  templates: {
    medical_necessity: {
      id: '1',
      name: 'Letter of Medical Necessity',
      isDefault: true,
      type: 'medical_necessity',
      intro: '...',
      rationale: '...',
      version: '1.0',
      content: '...',
    },
    appeal: {
      id: '2',
      name: 'Letter of Appeal',
      isDefault: true,
      type: 'appeal',
      intro: '...',
      rationale: '...',
      version: '1.0',
      content: '...',
    },
  },

  providers: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      title: 'MD',
      npi: '1234567890',
      practiceId: '1',
    },
  ],

  practices: {
    '1': {
      id: '1',
      name: 'Medical Center',
      address: '123 Healthcare Ave',
      city: 'Medical City',
      state: 'MC',
      zip: '12345',
      phone: '(555) 123-4567',
      logo: 'https://example.com/logo.png',
    },
  },

  currentUser: {
    id: '1',
    email: 'doctor@example.com',
    firstName: 'John',
    lastName: 'Doe',
    title: 'MD',
    npiNumber: '1234567890',
    practiceId: '1'
  },

  practiceProviders: [
    // ... array of mock providers
  ],

  // Add NPI lookup mock functions
  npiLookupByName: (organizationName: string) => {
    return {
      results: [
        {
          organization_name: `${organizationName} Medical Center`,
          number: '1234567890',
          addresses: [
            {
              address_1: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              postal_code: '12345',
              telephone_number: '555-123-4567'
            }
          ]
        },
        {
          organization_name: `${organizationName} Hospital`,
          number: '0987654321',
          addresses: [
            {
              address_1: '456 Oak Ave',
              city: 'Somewhere',
              state: 'NY',
              postal_code: '54321',
              telephone_number: '555-987-6543'
            }
          ]
        }
      ]
    };
  },

  npiLookupByProviderName: (firstName: string, lastName: string) => {
    return {
      results: [
        {
          basic: {
            first_name: firstName,
            last_name: lastName,
            credential: 'MD'
          },
          number: '1122334455',
          addresses: [
            {
              address_1: '789 Pine St',
              city: 'Elsewhere',
              state: 'TX',
              postal_code: '67890',
              telephone_number: '555-321-7654'
            }
          ]
        },
        {
          basic: {
            first_name: firstName,
            last_name: lastName,
            credential: 'DO'
          },
          number: '5544332211',
          addresses: [
            {
              address_1: '321 Elm Blvd',
              city: 'Nowhere',
              state: 'FL',
              postal_code: '09876',
              telephone_number: '555-765-4321'
            }
          ]
        }
      ]
    };
  },

  npiLookupByNumber: (npiNumber: string) => {
    return {
      results: [
        {
          organization_name: 'Sample Organization',
          number: npiNumber,
          addresses: [
            {
              address_1: '555 Medical Plaza',
              city: 'Healthville',
              state: 'WA',
              postal_code: '13579',
              telephone_number: '555-555-5555'
            }
          ]
        }
      ]
    };
  },
}; 