import axios, { AxiosError } from 'axios';
import type { Product, LetterTemplate, Provider, Practice } from '../types';
import { config } from '../config';
import { mockData } from '../mocks/mockData';

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
        return Promise.resolve(mockData.products);
      }
      this.handleError(error as AxiosError);
    }
  }

  async getTemplates(productId: string): Promise<LetterTemplate[]> {
    try {
      const response = await this.api.get<any[]>(`/templates/byProduct/${productId}`);
      return response.data.map(this.transformResponse);
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for templates');
        return Promise.resolve(Object.values(mockData.templates).map(template => ({
          ...template,
          productId,
        })));
      }
      this.handleError(error as AxiosError);
    }
  }

  async getProviders(): Promise<Provider[]> {
    try {
      const response = await this.api.get<Provider[]>('/providers');
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for providers');
        return Promise.resolve(mockData.providers);
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
        console.info('Using mock data for practice');
        const practice = mockData.practices[practiceId];
        if (!practice) {
          throw new Error(`No mock practice found for ID: ${practiceId}`);
        }
        return Promise.resolve(practice);
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