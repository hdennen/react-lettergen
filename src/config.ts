interface Config {
  apiBaseUrl: string;
  useMockData: boolean;
  auth0: {
    domain: string;
    clientId: string;
  };
}

export const config: Config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/v1',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || ''
  }
}; 