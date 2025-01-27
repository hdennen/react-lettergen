import React from 'react';
import { useParams } from 'react-router-dom';
import { useLetterStore } from '../store/letterStore';
import { TemplateSelection } from '../components/steps/TemplateSelection';
import { ProviderInformation } from '../components/steps/ProviderInformation';
import { PatientDetails } from '../components/steps/PatientDetails';
import { InsuranceDetails } from '../components/steps/InsuranceDetails';
import { DiagnosisInformation } from '../components/steps/DiagnosisInformation';
import { TreatmentHistory } from '../components/steps/TreatmentHistory';
import { FinalReview } from '../components/steps/FinalReview';
import { NavigationButtons } from '../components/NavigationButtons';

export const LetterBuilder: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { currentStep } = useLetterStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TemplateSelection productId={productId!} />;
      case 2:
        return <ProviderInformation />;
      case 3:
        return <PatientDetails />;
      case 4:
        return <InsuranceDetails />;
      case 5:
        return <DiagnosisInformation />;
      case 6:
        return <TreatmentHistory />;
      case 7:
        return <FinalReview />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStep()}
      <NavigationButtons />
    </div>
  );
};