import { create } from 'zustand';
import { apiService } from '../services/api';
import { UserProfile, Practice } from '../types';

interface UserState {
  currentUser: UserProfile | null;
  practice: Practice | null;
  practiceProviders: UserProfile[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: UserProfile) => void;
  setPractice: (practice: Practice) => void;
  setPracticeProviders: (providers: UserProfile[]) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updatePracticeInfo: (practiceData: Partial<Practice>) => Promise<void>;
  fetchUserAndPractice: () => Promise<void>;
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
  practice: {
    id: '',
    name: '',
    npiNumber: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    providers: [],
    logo: '',
  },
  practiceProviders: [],
  isLoading: false,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),
  
  setPractice: (practice) => set({ practice }),
  
  setPracticeProviders: (providers) => set({ practiceProviders: providers }),
  
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

  updatePracticeInfo: async (practiceData) => {
    try {
      set({ isLoading: true, error: null });
      const practice = get().practice;
      if (!practice) throw new Error('No practice found');
      
      const updatedPractice = { ...practice, ...practiceData };
      await apiService.updatePractice(updatedPractice);
      set({ practice: updatedPractice });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update practice' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserAndPractice: async () => {
    try {
      set({ isLoading: true, error: null });
      const userData = await apiService.getCurrentUser();
      set({ currentUser: userData });

      if (userData.practiceId) {
        const [practiceData, providers] = await Promise.all([
          apiService.getPractice(userData.practiceId),
          apiService.getPracticeProviders(userData.practiceId)
        ]);
        set({ 
          practice: practiceData,
          practiceProviders: providers
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
    practice: null,
    practiceProviders: [],
    isLoading: false,
    error: null
  })
})); 