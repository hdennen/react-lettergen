import type { Product, LetterTemplate, Provider, Practice } from '../types';

export interface MockData {
  products: Product[];
  templates: {
    [key: string]: Omit<LetterTemplate, 'productId'>;
  };
  providers: Provider[];
  practices: {
    [key: string]: Practice;
  };
} 