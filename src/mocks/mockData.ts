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
}; 