export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA || 'true'
}; 