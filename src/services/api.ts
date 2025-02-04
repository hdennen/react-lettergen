import axios, { AxiosError } from 'axios';
import type { Product, LetterTemplate, Provider, Practice } from '../types';
import { config } from '../config';

class ApiService {
  private baseUrl = config.apiBaseUrl;
  private api = axios.create({
    baseURL: this.baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getProducts(): Promise<Product[]> {
    try {
      const response = await this.api.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for products');
        return Promise.resolve([
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
        ]);
      }
      this.handleError(error as AxiosError);
    }
  }

  async getTemplates(productId: string): Promise<LetterTemplate[]> {
    try {
      const response = await this.api.get<any[]>(`/templates/byProduct/${productId}`);
      return response.data.map(this.transformResponse);
    } catch (error) {
      this.handleError(error as AxiosError);
      // Return mock data for demo
      return [
        {
          id: '1',
          name: 'Letter of Medical Necessity',
          productId,
          isDefault: true,
          type: 'medical_necessity',
          intro: '...',
          rationale: '...',
          version: '...',
          content: '...',
        },
        {
          id: '2',
          name: 'Letter of Appeal',
          productId,
          isDefault: true,
          type: 'appeal',
          intro: '...',
          rationale: '...',
          version: '...',
          content: '...',
        },
      ];
    }
  }

  async getProviders(): Promise<Provider[]> {
    try {
      const response = await this.api.get<Provider[]>('/providers');
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        return Promise.resolve([{
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          title: 'MD',
          npi: '1234567890',
          practiceId: '1'
        }]);
      }
      this.handleError(error as AxiosError);
    }
  }

  async getPractice(practiceId: string): Promise<Practice> {
    try {
      const response = await this.api.get<Practice>(`/practices/${practiceId}`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        return Promise.resolve({
          id: practiceId,
          name: 'Medical Center',
          address: '123 Healthcare Ave',
          city: 'Medical City',
          state: 'MC',
          zip: '12345',
          phone: '(555) 123-4567',
          logo: 'https://example.com/logo.png'
        });
      }
      this.handleError(error as AxiosError);
    }
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
      });
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('API Setup Error:', error.message);
      throw new Error('Error setting up the request');
    }
  }

  private transformResponse(data: any): LetterTemplate {
    return {
      id: data.id,
      name: data.title,
      productId: data.productId,
      isDefault: data.isDefault,
      type: data.type,
      intro: data.intro,
      rationale: data.rationale,
      version: data.version,
      content: data.content,
    };
  }
}

export const apiService = new ApiService(); 