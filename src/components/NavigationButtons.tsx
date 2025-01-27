import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLetterStore } from '../store/letterStore';
import { cn } from '../lib/utils';

export const NavigationButtons: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, setStep } = useLetterStore();

  const handlePrevious = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setStep(currentStep + 1);
    } else {
      navigate('/preview');
    }
  };

  return (
    <div className="flex justify-between pt-6 border-t">
      <button
        onClick={handlePrevious}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md',
          currentStep === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        )}
        disabled={currentStep === 1}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        {currentStep === 7 ? 'Preview Letter' : 'Next'}
      </button>
    </div>
  );
};