import { create } from 'zustand';
import { apiService } from '../services/api';
import { UserProfile, Organization } from '../types/index';

interface UserState {
  currentUser: UserProfile | null;
  organization: Organization | null;
  organizationProviders: UserProfile[];
  isLoading: boolean;
  error: string | null;
  
  // Form state for profile setup
  profileSetupForm: {
    personalInfo: {
      firstName: string;
      lastName: string;
      title: string;
      npiNumber: string;
      attestation: boolean;
    };
    practiceInfo: {
      name: string;
      npiNumber: string;
      address: string;
      phone: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  
  // Actions
  setCurrentUser: (user: UserProfile) => void;
  setOrganization: (organization: Organization) => void;
  setOrganizationProviders: (providers: UserProfile[]) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateOrganizationInfo: (organizationData: Partial<Organization>) => Promise<void>;
  fetchUserAndOrganization: () => Promise<void>;
  reset: () => void;
  
  // Profile setup form actions
  updateProfileSetupForm: (formData: Partial<UserState['profileSetupForm']>) => void;
  saveCompleteProfile: () => Promise<void>;
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
  
  // Initialize profile setup form state
  profileSetupForm: {
    personalInfo: {
      firstName: '',
      lastName: '',
      title: '',
      npiNumber: '',
      attestation: false,
    },
    practiceInfo: {
      name: '',
      npiNumber: '',
      address: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
    }
  },

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
  
  // Update profile setup form data
  updateProfileSetupForm: (formData) => {
    const currentForm = get().profileSetupForm;
    set({
      profileSetupForm: {
        ...currentForm,
        ...formData
      }
    });
  },
  
  // Save complete profile (personal info + practice/organization)
  saveCompleteProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const { profileSetupForm, currentUser } = get();
      
      if (!currentUser) throw new Error('No user logged in');
      
      // Verify attestation was checked
      if (!profileSetupForm.personalInfo.attestation) {
        throw new Error('You must attest to the accuracy of your information');
      }
      
      // 1. Update user profile with personal info
      const updatedUser = {
        ...currentUser,
        firstName: profileSetupForm.personalInfo.firstName,
        lastName: profileSetupForm.personalInfo.lastName,
        title: profileSetupForm.personalInfo.title,
        npiNumber: profileSetupForm.personalInfo.npiNumber,
      };
      await apiService.updateProfile(updatedUser);
      set({ currentUser: updatedUser });
      
      // 2. Create or update organization with practice info
      let organizationResponse;
      
      // If user already has an organization, update it instead of creating a new one
      if (currentUser.practiceId) {
        const existingOrg = get().organization;
        if (existingOrg) {
          organizationResponse = await apiService.updateOrganization({
            ...existingOrg,
            name: profileSetupForm.practiceInfo.name,
            npi: profileSetupForm.practiceInfo.npiNumber,
            locations: [
              ...(existingOrg.locations || []).filter(loc => !loc.isPrimary),
              {
                name: 'Main Office',
                addressLine1: profileSetupForm.practiceInfo.address,
                phone: profileSetupForm.practiceInfo.phone,
                city: profileSetupForm.practiceInfo.city,
                state: profileSetupForm.practiceInfo.state,
                zipCode: profileSetupForm.practiceInfo.zip,
                isPrimary: true
              }
            ]
          });
        } else {
          // Fetch the organization if it's not in the store
          organizationResponse = await apiService.getOrganization(currentUser.practiceId);
        }
      } else {
        // Create new organization
        organizationResponse = await apiService.createOrganization({
          name: profileSetupForm.practiceInfo.name,
          npi: profileSetupForm.practiceInfo.npiNumber,
          locations: [
            {
              name: 'Main Office',
              addressLine1: profileSetupForm.practiceInfo.address,
              phone: profileSetupForm.practiceInfo.phone,
              city: profileSetupForm.practiceInfo.city,
              state: profileSetupForm.practiceInfo.state,
              zipCode: profileSetupForm.practiceInfo.zip,
              isPrimary: true
            }
          ]
        });
      }
      
      if (!organizationResponse) {
        throw new Error('Failed to create or update organization');
      }
      
      // 3. Update organization in store
      set({ organization: organizationResponse });
      
      // 4. Update user with organization ID
      const userWithPractice = {
        ...updatedUser,
        practiceId: organizationResponse.id,
        profileCompleted: true
      };
      await apiService.updateProfile(userWithPractice);
      set({ currentUser: userWithPractice });
      
      // 5. Update organization providers list
      const providers = await apiService.getOrganizationProviders(organizationResponse.id);
      set({ organizationProviders: providers });
      
      return Promise.resolve();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to save profile' });
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
    error: null,
    profileSetupForm: {
      personalInfo: {
        firstName: '',
        lastName: '',
        title: '',
        npiNumber: '',
        attestation: false,
      },
      practiceInfo: {
        name: '',
        npiNumber: '',
        address: '',
        phone: '',
        city: '',
        state: '',
        zip: '',
      }
    }
  })
})); 