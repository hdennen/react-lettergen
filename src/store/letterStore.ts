import { create } from 'zustand';
import { LetterData } from '../types';

interface LetterStore {
  currentStep: number;
  letterData: Partial<LetterData>;
  setStep: (step: number) => void;
  updateLetterData: (data: Partial<LetterData>) => void;
  resetLetter: () => void;
}

const initialLetterData: Partial<LetterData> = {};

export const useLetterStore = create<LetterStore>((set) => ({
  currentStep: 1,
  letterData: initialLetterData,
  setStep: (step) => set({ currentStep: step }),
  updateLetterData: (data) =>
    set((state) => ({
      letterData: { ...state.letterData, ...data },
    })),
  resetLetter: () => set({ letterData: initialLetterData, currentStep: 1 }),
}));