import { create } from 'zustand';
import type { LetterTemplate } from '../types';
import { apiService } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
}

interface ProductStore {
  products: Product[];
  templates: Record<string, LetterTemplate[]>; // Key is productId
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchTemplates: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  templates: {},
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await apiService.getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch products',
        isLoading: false,
        products: []
      });
    }
  },

  fetchTemplates: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const templates = await apiService.getTemplates(productId);
      set(state => ({
        templates: { ...state.templates, [productId]: templates },
        isLoading: false
      }));
    } catch (error) {
      set(state => ({ 
        error: 'Failed to fetch templates',
        isLoading: false,
        templates: {
          ...state.templates,
          [productId]: []
        }
      }));
    }
  },
})); 