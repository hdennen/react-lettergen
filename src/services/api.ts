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
      console.info(`Getting templates for product ${productId}`);
      const response = await this.api.get<LetterTemplate[]>(`/Templates/byProduct/${productId}`);
      return response.data.map(template => this.transformResponse(template));
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for templates');
        // Create properly typed templates with productId
        const templates = Object.values(mockData.templates).map(template => ({
          id: template.id,
          name: template.name,
          productId: productId, // Add the productId parameter
          isDefault: template.isDefault,
          type: template.type as 'medical_necessity' | 'appeal',
          intro: template.intro,
          rationale: template.rationale,
          version: template.version,
          content: template.content,
        }));
        
        return Promise.resolve(templates);
      }
      this.handleError(error as AxiosError);
    }
  }

  async getProviders(): Promise<Provider[]> {
    try {
      console.info('Getting providers');
      const response = await this.api.get<Provider[]>('/providers');
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for providers');
        return Promise.resolve(mockData.providers.map(provider => ({
          ...provider,
          npiNumber: provider.npi, // Map npi to npiNumber
        })));
      }
      this.handleError(error as AxiosError);
    }
  }

  async getPractice(practiceId: string): Promise<Practice> {
    try {
      console.info(`Getting practice ${practiceId}`);
      const response = await this.api.get<Practice>(`/practices/${practiceId}`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for practice');
        // Use type assertion to safely access the practice
        const practices = mockData.practices as Record<string, Practice>;
        const practice = practices[practiceId];
        
        if (!practice) {
          throw new Error(`Practice with ID ${practiceId} not found`);
        }
        
        return Promise.resolve(practice);
      }
      this.handleError(error as AxiosError);
    }
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    try {
      console.info(`Getting organization ${organizationId}`);
      const response = await this.api.get<Organization>(`/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization');
        // Use type assertion to safely access the practice
        const practices = mockData.practices as Record<string, Practice>;
        const practice = practices[organizationId];
        
        if (!practice) {
          throw new Error(`Organization with ID ${organizationId} not found`);
        }
        
        // Convert Practice to Organization format
        return Promise.resolve({
          id: practice.id,
          name: practice.name,
          npi: practice.id, // Using ID as NPI for mock data
          locations: [{
            id: '1',
            name: 'Main Office',
            addressLine1: practice.address,
            city: practice.city,
            state: practice.state,
            zipCode: practice.zip,
            phone: practice.phone,
            isPrimary: true
          }]
        });
      }
      this.handleError(error as AxiosError);
    }
  }

  async getOrganizationProviders(organizationId: string): Promise<UserProfile[]> {
    try {
      console.info(`Getting providers for organization ${organizationId}`);
      const response = await this.api.get<UserProfile[]>(`/organizations/${organizationId}/providers`);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization providers');
        // Use type assertion to safely check if the practice exists
        const practices = mockData.practices as Record<string, Practice>;
        if (!practices[organizationId]) {
          return Promise.resolve([]);
        }
        
        // Return mock providers with correct type
        return Promise.resolve(mockData.providers.map(provider => ({
          id: provider.id,
          email: `${provider.firstName.toLowerCase()}@example.com`,
          firstName: provider.firstName,
          lastName: provider.lastName,
          title: provider.title,
          npiNumber: provider.npi,
          practiceId: provider.practiceId
        })));
      }
      this.handleError(error as AxiosError);
    }
  }

  async updateOrganization(organizationData: Organization): Promise<Organization> {
    try {
      // Transform the data to match the expected OrganizationCreateDto structure
      const organizationUpdateDto = {
        name: organizationData.name,
        npi: organizationData.npi,
        logoUrl: organizationData.logoUrl || '',
        locations: organizationData.locations.map(location => ({
          name: location.name,
          addressLine1: location.addressLine1,
          addressLine2: location.addressLine2 || '',
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          phone: location.phone || '',
          isPrimary: location.isPrimary
        }))
      };
      
      const response = await this.api.put<Organization>(`/organizations/${organizationData.id}`, organizationUpdateDto);
      return response.data;
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for organization update');
        return Promise.resolve(organizationData);
      }
      this.handleError(error as AxiosError);
    }
  }

  async createOrganization(organizationData: Omit<Organization, 'id'>): Promise<Organization> {
    try {
      // Transform the data to match the expected OrganizationCreateDto structure
      const organizationCreateDto = {
        name: organizationData.name,
        npi: organizationData.npi,
        logoUrl: organizationData.logoUrl || '',
        locations: organizationData.locations.map(location => ({
          name: location.name,
          addressLine1: location.addressLine1,
          addressLine2: location.addressLine2 || '',
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          phone: location.phone || '',
          isPrimary: location.isPrimary
        }))
      };
      
      const response = await this.api.post<Organization>('/organizations', organizationCreateDto);
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
      await this.api.put(`/Users/${profileData.id}`, profileData);
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

  async addUserToOrganization(userId: string, organizationId: string, roleId: string = ''): Promise<void> {
    try {
      await this.api.post('/UserOrganizations', {
        userId,
        organizationId,
        roleId: roleId || undefined
      });
    } catch (error) {
      if (config.useMockData) {
        console.info('Using mock data for adding user to organization');
        return Promise.resolve();
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

  // Epic integration methods
  async getEpicAuthUrl(): Promise<{ authorizationUrl: string }> {
    try {
      const response = await this.api.get<{ authorizationUrl: string }>('/epic/auth/url');
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async handleEpicCallback(code: string, state: string): Promise<any> {
    try {
      const response = await this.api.post('/epic/auth/callback', { code, state });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getEpicConnectionStatus(): Promise<{ isConnected: boolean }> {
    try {
      const response = await this.api.get<{ isConnected: boolean }>('/epic/connection/status');
      return response.data;
    } catch (error) {
      console.error('Error checking Epic connection status:', error);
      return { isConnected: false };
    }
  }

  async disconnectFromEpic(): Promise<void> {
    try {
      await this.api.post('/v1/epic/connection/disconnect');
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }
}

export const apiService = new ApiService(); 