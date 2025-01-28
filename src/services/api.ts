import type { Product, LetterTemplate } from '../types';
import { config } from '../config';

class ApiService {
  private baseUrl = config.apiBaseUrl;

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      // Return mock data for demo
      return [
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
      ];
    }
  }

  async getTemplates(productId: string): Promise<LetterTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/byProduct/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch templates');

      const data = await response.json();
      const templates = data.map(this.transformResponse);
      console.log('templates:');
      console.log(templates);
        
      return templates
    } catch (error) {
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

  private transformResponse(data: any): LetterTemplate {
    console.log('raw template response data:');
    console.log(data);

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