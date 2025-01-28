import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/productStore';

export const ProductSelection: React.FC = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, isLoading } = useProductStore();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Medical Letter Generator
          </h1>
          <p className="text-lg text-gray-600">
            Select a product to begin creating your letter
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/letter/${product.id}`)}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left group"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
              </div>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};