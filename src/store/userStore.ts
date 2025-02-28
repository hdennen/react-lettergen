import { create } from 'zustand';
import { apiService } from '../services/api';
import { UserProfile, Organization } from '../types';

interface UserState {
  currentUser: UserProfile | null;
  organization: Organization | null;
  organizationProviders: UserProfile[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: UserProfile) => void;
  setOrganization: (organization: Organization) => void;
  setOrganizationProviders: (providers: UserProfile[]) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateOrganizationInfo: (organizationData: Partial<Organization>) => Promise<void>;
  fetchUserAndOrganization: () => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    title: '',
    npiNumber: '',
    practiceId: '',
  },
  organization: null,
  organizationProviders: [],
  isLoading: false,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),
  
  setOrganization: (organization) => set({ organization }),
  
  setOrganizationProviders: (providers) => set({ organizationProviders: providers }),
  
  updateUserProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const currentUser = get().currentUser;
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedProfile = { ...currentUser, ...profileData };
      await apiService.updateProfile(updatedProfile);
      set({ currentUser: updatedProfile });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrganizationInfo: async (organizationData) => {
    try {
      set({ isLoading: true, error: null });
      const organization = get().organization;
      if (!organization) throw new Error('No organization found');
      
      const updatedOrganization = { ...organization, ...organizationData };
      await apiService.updateOrganization(updatedOrganization);
      set({ organization: updatedOrganization });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update organization' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserAndOrganization: async () => {
    try {
      set({ isLoading: true, error: null });
      const userData = await apiService.getCurrentUser();
      set({ currentUser: userData });

      if (userData.practiceId) {
        const [organizationData, providers] = await Promise.all([
          apiService.getOrganization(userData.practiceId),
          apiService.getOrganizationProviders(userData.practiceId)
        ]);
        set({ 
          organization: organizationData,
          organizationProviders: providers
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch user data' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({
    currentUser: null,
    organization: null,
    organizationProviders: [],
    isLoading: false,
    error: null
  })
})); 