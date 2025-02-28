import axios, { AxiosError } from 'axios';
import type { Product, LetterTemplate, Provider, Practice, NPIResponse, UserProfile, User, Organization } from '../types/index';
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

  // Method to set the auth token for API requests
  public setAuthToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.info('Auth token added to API requests');
      console.log('Auth token:', token);
    } else {
      delete this.api.defaults.headers.common['Authorization'];
      console.info('Auth token removed from API requests');
    }
  }

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
        return Promise.resolve(practice);
      }
      this.handleError(error as AxiosError);
    }
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    try {
      const response = await this.api.get<Organization>(`/v1/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization');
        const practice = mockData.practices[organizationId];
        if (!practice) {
          throw new Error(`Organization with ID ${organizationId} not found`);
        }
        
        return Promise.resolve({
          id: practice.id,
          name: practice.name,
          npi: practice.npiNumber,
          logoUrl: practice.logo,
          locations: [
            {
              id: `loc_${practice.id}`,
              name: 'Main Office',
              addressLine1: practice.address,
              city: practice.city,
              state: practice.state,
              zipCode: practice.zip,
              phone: practice.phone,
              isPrimary: true
            }
          ],
          providers: practice.providers
        });
      }
      this.handleError(error as AxiosError);
    }
  }

  async getOrganizationProviders(organizationId: string): Promise<UserProfile[]> {
    try {
      const response = await this.api.get<UserProfile[]>(`/v1/organizations/${organizationId}/providers`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization providers');
        const practice = mockData.practices[organizationId];
        return Promise.resolve(practice?.providers || []);
      }
      this.handleError(error as AxiosError);
    }
  }

  async updateOrganization(organizationData: Organization): Promise<void> {
    try {
      await this.api.put(`/v1/organizations/${organizationData.id}`, organizationData);
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization update');
        return Promise.resolve();
      }
      this.handleError(error as AxiosError);
    }
  }

  async createOrganization(organizationData: Omit<Organization, 'id'>): Promise<Organization> {
    try {
      const response = await this.api.post<Organization>('/v1/organizations', organizationData);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization creation');
        return Promise.resolve({
          id: 'org_' + Date.now(),
          ...organizationData,
        });
      }
      this.handleError(error as AxiosError);
    }
  }

  async lookupNPIByName(organizationName: string): Promise<NPIResponse> {
    try {
      const response = await axios.get<NPIResponse>(
        'https://npiregistry.cms.hhs.gov/api/?version=2.1',
        { params: { organization_name: organizationName } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async lookupNPIByNumber(npiNumber: string): Promise<NPIResponse> {
    try {
      const response = await axios.get<NPIResponse>(
        'https://npiregistry.cms.hhs.gov/api/?version=2.1',
        { params: { number: npiNumber } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async saveProfile(profileData: {
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
  }): Promise<void> {
    try {
      await this.api.post('/profile', profileData);
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for profile save');
        return Promise.resolve();
      }
      this.handleError(error as AxiosError);
    }
  }

  async getCurrentUser(): Promise<UserProfile> {
    try {
      console.info('Getting current user');
      const response = await this.api.get<UserProfile>('/Users/current');
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for current user');
        return Promise.resolve(mockData.currentUser);
      }
      this.handleError(error as AxiosError);
    }
  }

  async updateProfile(profileData: UserProfile): Promise<void> {
    try {
      await this.api.put(`/user/${profileData.id}`, profileData);
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for profile update');
        return Promise.resolve();
      }
      this.handleError(error as AxiosError);
    }
  }

  async updatePractice(practiceData: Practice): Promise<void> {
    try {
      await this.api.put(`/practices/${practiceData.id}`, practiceData);
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for practice update');
        return Promise.resolve();
      }
      this.handleError(error as AxiosError);
    }
  }

  async getPracticeProviders(practiceId: string): Promise<UserProfile[]> {
    try {
      const response = await this.api.get<UserProfile[]>(`/practices/${practiceId}/providers`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for practice providers');
        return Promise.resolve(mockData.practiceProviders || []);
      }
      this.handleError(error as AxiosError);
    }
  }

  async createOrUpdatePractice(practiceData: Omit<Practice, 'id'>): Promise<Practice> {
    try {
      const response = await this.api.post<Practice>('/practices', practiceData);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for practice creation');
        return Promise.resolve({
          id: 'practice_' + Date.now(),
          ...practiceData,
          logo: '' // Add any required fields that weren't in the input
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

  async signup(email: string, password: string): Promise<User> {
    try {
      const response = await this.api.post('/signup', { email, password });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }
}

export const apiService = new ApiService(); 