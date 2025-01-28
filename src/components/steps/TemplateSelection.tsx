import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { CalendarIcon } from 'lucide-react';
import { useProductStore } from '../../store/productStore';

interface TemplateSelectionProps {
  productId: string;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({ productId }) => {
  const { letterData, updateLetterData } = useLetterStore();
  const { templates, fetchTemplates, isLoading } = useProductStore();

  React.useEffect(() => {
    fetchTemplates(productId);
  }, [productId, fetchTemplates]);

  const productTemplates = templates[productId] || [];

  const handleTemplateSelect = (templateId: string) => {
    updateLetterData({ templateId });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLetterData({ letterDate: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">Select Letter Template</h2>
        <p className="text-sm text-gray-500">
          Choose a template that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {productTemplates.map((template) => (
          <div
            key={template.id}
            className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
              letterData.templateId === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-600'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                {template.isDefault && (
                  <span className="inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    Default Template
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="letterDate" className="block text-sm font-medium text-gray-700">
          Letter Date
        </label>
        <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="letterDate"
            name="letterDate"
            value={letterData.letterDate || ''}
            onChange={handleDateChange}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};