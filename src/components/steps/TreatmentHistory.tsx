import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { History, PlusCircle, XCircle, ClipboardList } from 'lucide-react';
import type { Treatment } from '../../types';

export const TreatmentHistory: React.FC = () => {
  const { letterData, updateLetterData } = useLetterStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateLetterData({
      treatmentHistory: {
        ...letterData.treatmentHistory,
        [name]: value,
      },
    });
  };

  const handleTreatmentChange = (index: number, field: keyof Treatment, value: string) => {
    const updatedTreatments = [...(letterData.treatmentHistory?.treatments || [])];
    updatedTreatments[index] = {
      ...updatedTreatments[index],
      [field]: value,
    };

    updateLetterData({
      treatmentHistory: {
        ...letterData.treatmentHistory,
        treatments: updatedTreatments,
      },
    });
  };

  const addTreatment = () => {
    const newTreatment: Treatment = {
      id: crypto.randomUUID(),
      date: '',
      treatment: '',
      outcome: '',
    };

    updateLetterData({
      treatmentHistory: {
        ...letterData.treatmentHistory,
        treatments: [...(letterData.treatmentHistory?.treatments || []), newTreatment],
      },
    });
  };

  const removeTreatment = (index: number) => {
    const updatedTreatments = [...(letterData.treatmentHistory?.treatments || [])];
    updatedTreatments.splice(index, 1);

    updateLetterData({
      treatmentHistory: {
        ...letterData.treatmentHistory,
        treatments: updatedTreatments,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">Treatment History</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
        {/* Condition Description */}
        <div>
          <label htmlFor="conditionDescription" className="block text-sm font-medium text-gray-700">
            Condition Description
          </label>
          <textarea
            id="conditionDescription"
            name="conditionDescription"
            rows={3}
            value={letterData.treatmentHistory?.conditionDescription || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe the patient's condition and its progression..."
            required
          />
        </div>

        {/* Previous Treatments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Previous Treatments</h3>
            </div>
            <button
              type="button"
              onClick={addTreatment}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Treatment
            </button>
          </div>

          <div className="space-y-4">
            {letterData.treatmentHistory?.treatments?.map((treatment, index) => (
              <div key={treatment.id} className="relative bg-gray-50 p-4 rounded-lg">
                <button
                  type="button"
                  onClick={() => removeTreatment(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <XCircle className="h-5 w-5" />
                </button>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={treatment.date}
                      onChange={(e) => handleTreatmentChange(index, 'date', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Treatment</label>
                    <input
                      type="text"
                      value={treatment.treatment}
                      onChange={(e) => handleTreatmentChange(index, 'treatment', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., Physical Therapy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Outcome</label>
                    <input
                      type="text"
                      value={treatment.outcome}
                      onChange={(e) => handleTreatmentChange(index, 'outcome', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., Limited improvement"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {!letterData.treatmentHistory?.treatments?.length && (
              <p className="text-sm text-gray-500 text-center py-4">
                No treatments added. Click "Add Treatment" to include previous treatments and their outcomes.
              </p>
            )}
          </div>
        </div>

        {/* Treatment Rationale */}
        <div>
          <label htmlFor="rationale" className="block text-sm font-medium text-gray-700">
            Treatment Rationale
          </label>
          <textarea
            id="rationale"
            name="rationale"
            rows={4}
            value={letterData.treatmentHistory?.rationale || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Explain why previous treatments were insufficient and why the requested treatment is necessary..."
            required
          />
        </div>

        <div className="mt-6 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <p className="text-sm text-gray-500">
            Document all previous treatments and their outcomes to demonstrate medical necessity for the requested treatment.
          </p>
        </div>
      </div>
    </div>
  );
};