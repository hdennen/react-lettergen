import React from 'react';
import { useLetterStore } from '../store/letterStore';
import { FileText } from 'lucide-react';

const steps = [
  'Select Template',
  'Provider Information',
  'Patient Details',
  'Insurance Details',
  'Diagnosis Information',
  'Treatment History',
  'Final Review',
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep, setStep } = useLetterStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <nav className="space-y-1">
              {steps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => setStep(index + 1)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentStep === index + 1
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}. {step}
                </button>
              ))}
            </nav>
          </div>
          <div className="col-span-9">
            <div className="bg-white shadow-sm rounded-lg p-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};