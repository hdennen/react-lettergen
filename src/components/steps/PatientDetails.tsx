import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { User } from 'lucide-react';

export const PatientDetails: React.FC = () => {
  const { letterData, updateLetterData } = useLetterStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateLetterData({
      patient: {
        ...letterData.patient,
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={letterData.patient?.firstName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={letterData.patient?.lastName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={letterData.patient?.dateOfBirth || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="mt-6 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <p className="text-sm text-gray-500">
            This information will be used in the letter to identify the patient and their medical records.
          </p>
        </div>
      </div>
    </div>
  );
};