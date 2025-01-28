import React from 'react';
import { useLetterStore } from '../store/letterStore';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const Preview: React.FC = () => {
  const { letterData } = useLetterStore();
  const navigate = useNavigate();
  const letterRef = React.useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const downloadPDF = () => {
    if (!letterRef.current) return;

    const pdf = new jsPDF({
      unit: 'pt',
      format: 'letter',
    });

    pdf.html(letterRef.current, {
      callback: function (doc) {
        doc.save('medical_necessity_letter.pdf');
      },
      x: 40,
      y: 40,
      width: 520,
      windowWidth: 650,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Edit
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Letter of Medical Necessity</h1>
              </div>
              <p className="text-gray-600">{formatDate(letterData.letterDate || '')}</p>
            </div>

            <div ref={letterRef} className="space-y-6 text-gray-900">
              {/* Insurance Company Address */}
              <div className="mb-8">
                <p className="font-medium">{letterData.insurance?.company?.name}</p>
                <p>{letterData.insurance?.company?.contactName}</p>
                <p>{letterData.insurance?.company?.address1}</p>
                {letterData.insurance?.company?.address2 && (
                  <p>{letterData.insurance?.company?.address2}</p>
                )}
                <p>
                  {letterData.insurance?.company?.city}, {letterData.insurance?.company?.state}{' '}
                  {letterData.insurance?.company?.zip}
                </p>
              </div>

              {/* Re: Line */}
              <div className="mb-6">
                <p className="font-medium">
                  Re: {letterData.patient?.firstName} {letterData.patient?.lastName}
                </p>
                <p>Policy Number: {letterData.insurance?.policyNumber}</p>
                {letterData.insurance?.groupNumber && (
                  <p>Group Number: {letterData.insurance?.groupNumber}</p>
                )}
              </div>

              {/* Salutation */}
              <p>Dear {letterData.insurance?.company?.contactName || 'Sir/Madam'},</p>

              {/* Introduction */}
              <p className="whitespace-pre-line">
                {letterData.template?.intro}
              </p>

              {/* Diagnosis */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Diagnosis</h2>
                <p>
                  {letterData.patient?.firstName} has been diagnosed with {letterData.diagnosis?.description}{' '}
                  (ICD-10: {letterData.diagnosis?.icd10Code}).
                </p>
                {letterData.diagnosis?.labResults && letterData.diagnosis.labResults.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium mb-1">Relevant Laboratory Results:</p>
                    <ul className="list-disc pl-5">
                      {letterData.diagnosis.labResults.map((result) => (
                        <li key={result.id}>
                          {result.test}: {result.result} {result.unit} ({formatDate(result.date)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Treatment History */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Treatment History</h2>
                <p>{letterData.treatmentHistory?.conditionDescription}</p>
                {letterData.treatmentHistory?.treatments && letterData.treatmentHistory.treatments.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium mb-1">Previous Treatments and Outcomes:</p>
                    <ul className="list-disc pl-5">
                      {letterData.treatmentHistory.treatments.map((treatment) => (
                        <li key={treatment.id}>
                          {treatment.treatment} ({formatDate(treatment.date)}): {treatment.outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-2">{letterData.treatmentHistory?.rationale}</p>
              </div>

              {/* Medical Necessity */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Medical Necessity</h2>
                <p className="whitespace-pre-line">{letterData.finalRationale}</p>
              </div>

              {/* Closing */}
              <div className="mt-8">
                <p>
                  If you require any additional information, please don't hesitate to contact my office.
                  Thank you for your prompt attention to this matter.
                </p>
                <div className="mt-8">
                  <p>Sincerely,</p>
                  <p className="mt-4 font-medium">
                    {letterData.provider?.title} {letterData.provider?.firstName}{' '}
                    {letterData.provider?.lastName}
                  </p>
                  <p>NPI: {letterData.provider?.npi}</p>
                  <p>{letterData.practice?.name}</p>
                  <p>{letterData.practice?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};