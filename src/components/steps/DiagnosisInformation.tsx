import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { Stethoscope, PlusCircle, XCircle, FileSpreadsheet } from 'lucide-react';
import type { LabResult } from '../../types';

export const DiagnosisInformation: React.FC = () => {
  const { letterData, updateLetterData } = useLetterStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateLetterData({
      diagnosis: {
        ...letterData.diagnosis,
        [name]: value,
      },
    });
  };

  const handleLabResultChange = (index: number, field: keyof LabResult, value: string) => {
    const updatedLabResults = [...(letterData.diagnosis?.labResults || [])];
    updatedLabResults[index] = {
      ...updatedLabResults[index],
      [field]: value,
    };

    updateLetterData({
      diagnosis: {
        ...letterData.diagnosis,
        labResults: updatedLabResults,
      },
    });
  };

  const addLabResult = () => {
    const newLabResult: LabResult = {
      id: crypto.randomUUID(),
      date: '',
      test: '',
      result: '',
      unit: '',
    };

    updateLetterData({
      diagnosis: {
        ...letterData.diagnosis,
        labResults: [...(letterData.diagnosis?.labResults || []), newLabResult],
      },
    });
  };

  const removeLabResult = (index: number) => {
    const updatedLabResults = [...(letterData.diagnosis?.labResults || [])];
    updatedLabResults.splice(index, 1);

    updateLetterData({
      diagnosis: {
        ...letterData.diagnosis,
        labResults: updatedLabResults,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">Diagnosis Information</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
        {/* Primary Diagnosis */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Primary Diagnosis</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="icd10Code" className="block text-sm font-medium text-gray-700">
                ICD-10 Code
              </label>
              <input
                type="text"
                id="icd10Code"
                name="icd10Code"
                value={letterData.diagnosis?.icd10Code || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                placeholder="e.g., J45.50"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Diagnosis Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={letterData.diagnosis?.description || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                placeholder="e.g., Severe persistent asthma"
              />
            </div>
          </div>
        </div>

        {/* Lab Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Lab Results</h3>
            </div>
            <button
              type="button"
              onClick={addLabResult}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Lab Result
            </button>
          </div>

          <div className="space-y-4">
            {letterData.diagnosis?.labResults?.map((labResult, index) => (
              <div key={labResult.id} className="relative bg-gray-50 p-4 rounded-lg">
                <button
                  type="button"
                  onClick={() => removeLabResult(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <XCircle className="h-5 w-5" />
                </button>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={labResult.date}
                      onChange={(e) => handleLabResultChange(index, 'date', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Test Name</label>
                    <input
                      type="text"
                      value={labResult.test}
                      onChange={(e) => handleLabResultChange(index, 'test', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                      placeholder="e.g., Blood Glucose"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Result</label>
                    <input
                      type="text"
                      value={labResult.result}
                      onChange={(e) => handleLabResultChange(index, 'result', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <input
                      type="text"
                      value={labResult.unit}
                      onChange={(e) => handleLabResultChange(index, 'unit', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                      placeholder="e.g., mg/dL"
                    />
                  </div>
                </div>
              </div>
            ))}

            {!letterData.diagnosis?.labResults?.length && (
              <p className="text-sm text-gray-500 text-center py-4">
                No lab results added. Click "Add Lab Result" to include relevant test results.
              </p>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">
            Additional Details
          </label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            rows={4}
            value={letterData.diagnosis?.additionalDetails || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter any additional relevant diagnosis information..."
          />
        </div>

        <div className="mt-6 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <p className="text-sm text-gray-500">
            Include all relevant diagnosis codes and supporting lab results to strengthen the medical necessity of the requested treatment.
          </p>
        </div>
      </div>
    </div>
  );
};