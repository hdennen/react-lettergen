import { config } from '../config';
import { apiService } from './api';

/**
 * Service for handling Epic Systems integration
 */
export const epicService = {
  /**
   * Initiates the Epic OAuth2 authorization flow
   * This follows the Epic Standalone Launch flow
   */
  initiateEpicAuth: async () => {
    try {
      // Get the authorization URL from the backend
      const response = await apiService.getEpicAuthUrl();
      
      // Redirect the user to Epic's authorization page
      if (response && response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      } else {
        throw new Error('Failed to get Epic authorization URL');
      }
    } catch (error) {
      console.error('Error initiating Epic authorization:', error);
      throw error;
    }
  },

  /**
   * Handles the callback from Epic after authorization
   * @param code The authorization code returned by Epic
   * @param state The state parameter for security validation
   */
  handleEpicCallback: async (code: string, state: string) => {
    try {
      return await apiService.handleEpicCallback(code, state);
    } catch (error) {
      console.error('Error handling Epic callback:', error);
      throw error;
    }
  },

  /**
   * Checks if the user is connected to Epic
   */
  isConnectedToEpic: async () => {
    try {
      const response = await apiService.getEpicConnectionStatus();
      return response.isConnected;
    } catch (error) {
      console.error('Error checking Epic connection status:', error);
      return false;
    }
  },

  /**
   * Disconnects the user from Epic
   */
  disconnectFromEpic: async () => {
    try {
      await apiService.disconnectFromEpic();
      return true;
    } catch (error) {
      console.error('Error disconnecting from Epic:', error);
      throw error;
    }
  }
}; 