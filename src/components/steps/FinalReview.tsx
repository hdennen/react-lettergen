import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { FileCheck, User, Building2, Stethoscope, History, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinalReview: React.FC = () => {
  const { letterData, updateLetterData } = useLetterStore();
  const navigate = useNavigate();
  const inputClassName = "block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  const handleFinalRationaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLetterData({ finalRationale: e.target.value });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode,
    editStep: number
  ) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
        <button
          onClick={() => letterData.setStep(editStep)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="p-4">{content}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileCheck className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">Final Review</h2>
      </div>

      <div className="space-y-6">
        {/* Provider Information */}
        {renderSection(
          'Provider Information',
          <Building2 className="h-4 w-4 text-gray-500" />,
          <div className="space-y-3">
            <p className="text-sm text-gray-900">
              <span className="font-medium">Provider:</span>{' '}
              {letterData.provider?.title} {letterData.provider?.firstName} {letterData.provider?.lastName}
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-medium">NPI:</span> {letterData.provider?.npi}
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-medium">Practice:</span> {letterData.practice?.name}
            </p>
          </div>,
          2
        )}

        {/* Patient Information */}
        {renderSection(
          'Patient Information',
          <User className="h-4 w-4 text-gray-500" />,
          <div className="space-y-3">
            <p className="text-sm text-gray-900">
              <span className="font-medium">Name:</span>{' '}
              {letterData.patient?.firstName} {letterData.patient?.lastName}
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-medium">Date of Birth:</span>{' '}
              {formatDate(letterData.patient?.dateOfBirth || '')}
            </p>
          </div>,
          3
        )}

        {/* Insurance Information */}
        {renderSection(
          'Insurance Information',
          <FileText className="h-4 w-4 text-gray-500" />,
          <div className="space-y-3">
            <p className="text-sm text-gray-900">
              <span className="font-medium">Insurance:</span> {letterData.insurance?.company?.name}
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-medium">Policy Number:</span> {letterData.insurance?.policyNumber}
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-medium">Policy Holder:</span>{' '}
              {letterData.insurance?.policyHolder?.firstName} {letterData.insurance?.policyHolder?.lastName}
            </p>
          </div>,
          4
        )}

        {/* Diagnosis Information */}
        {renderSection(
          'Diagnosis Information',
          <Stethoscope className="h-4 w-4 text-gray-500" />,
          <div className="space-y-3">
            <p className="text-sm text-gray-900">
              <span className="font-medium">ICD-10:</span> {letterData.diagnosis?.icd10Code}
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-medium">Diagnosis:</span> {letterData.diagnosis?.description}
            </p>
            {letterData.diagnosis?.labResults && letterData.diagnosis.labResults.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Lab Results:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {letterData.diagnosis.labResults.map((result) => (
                    <li key={result.id} className="text-sm text-gray-900">
                      {result.test}: {result.result} {result.unit} ({formatDate(result.date)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>,
          5
        )}

        {/* Treatment History */}
        {renderSection(
          'Treatment History',
          <History className="h-4 w-4 text-gray-500" />,
          <div className="space-y-3">
            <p className="text-sm text-gray-900">
              <span className="font-medium">Condition:</span>{' '}
              {letterData.treatmentHistory?.conditionDescription}
            </p>
            {letterData.treatmentHistory?.treatments && letterData.treatmentHistory.treatments.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Previous Treatments:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {letterData.treatmentHistory.treatments.map((treatment) => (
                    <li key={treatment.id} className="text-sm text-gray-900">
                      {treatment.treatment} - {treatment.outcome} ({formatDate(treatment.date)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>,
          6
        )}

        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <label htmlFor="introduction" className={labelClassName}>
              Letter Introduction
            </label>
            {letterData.template?.intro && (
              <button
                onClick={() => updateLetterData({ introduction: letterData.template?.intro })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Use Template Introduction
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              id="introduction"
              rows={6}
              value={letterData.introduction || ''}
              onChange={(e) => updateLetterData({ introduction: e.target.value })}
              className={inputClassName}
              placeholder="Write your letter introduction here..."
              required
            />
          </div>
        </div>

        {/* Final Rationale */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <label htmlFor="finalRationale" className={labelClassName}>
              Final Rationale for Medical Necessity
            </label>
            {letterData.template?.rationale && (
              <button
                onClick={() => updateLetterData({ finalRationale: letterData.template?.rationale })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Use Template Rationale
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              id="finalRationale"
              rows={6}
              value={letterData.finalRationale || ''}
              onChange={handleFinalRationaleChange}
              className={inputClassName}
              placeholder="Explain the medical necessity for the requested treatment..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/preview')}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Letter
          </button>
        </div>
      </div>
    </div>
  );
};