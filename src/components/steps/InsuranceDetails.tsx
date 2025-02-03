import React from 'react';
import { useLetterStore } from '../../store/letterStore';
import { Building, User2 } from 'lucide-react';

export const InsuranceDetails: React.FC = () => {
  const { letterData, updateLetterData } = useLetterStore();
  const inputClassName = "block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    updateLetterData({
      insurance: {
        ...letterData.insurance,
        [section]: section === 'company' || section === 'policyHolder'
          ? {
              ...(letterData.insurance?.[section] || {}),
              [field]: value,
            }
          : value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">Insurance Information</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
        {/* Policy Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Policy Details</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="policyNumber" className={labelClassName}>
                Policy Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="policyNumber"
                  name="policyNumber"
                  value={letterData.insurance?.policyNumber || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter policy number"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="groupNumber" className={labelClassName}>
                Group Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="groupNumber"
                  name="groupNumber"
                  value={letterData.insurance?.groupNumber || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter group number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Policy Holder Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User2 className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Policy Holder Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="policyHolder.firstName" className={labelClassName}>
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="policyHolder.firstName"
                  name="policyHolder.firstName"
                  value={letterData.insurance?.policyHolder?.firstName || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="policyHolder.lastName" className={labelClassName}>
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="policyHolder.lastName"
                  name="policyHolder.lastName"
                  value={letterData.insurance?.policyHolder?.lastName || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="policyHolder.dateOfBirth" className={labelClassName}>
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="policyHolder.dateOfBirth"
                  name="policyHolder.dateOfBirth"
                  value={letterData.insurance?.policyHolder?.dateOfBirth || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Company Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Insurance Company Details</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="company.name" className={labelClassName}>
                Company Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.name"
                  name="company.name"
                  value={letterData.insurance?.company?.name || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="company.contactName" className={labelClassName}>
                Contact Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.contactName"
                  name="company.contactName"
                  value={letterData.insurance?.company?.contactName || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter contact name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company.contactTitle" className={labelClassName}>
                Contact Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.contactTitle"
                  name="company.contactTitle"
                  value={letterData.insurance?.company?.contactTitle || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter contact title"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company.phone" className={labelClassName}>
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="company.phone"
                  name="company.phone"
                  value={letterData.insurance?.company?.phone || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company.address1" className={labelClassName}>
                Address Line 1
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.address1"
                  name="company.address1"
                  value={letterData.insurance?.company?.address1 || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter street address"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company.address2" className={labelClassName}>
                Address Line 2
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.address2"
                  name="company.address2"
                  value={letterData.insurance?.company?.address2 || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter apartment, suite, etc."
                />
              </div>
            </div>
            <div>
              <label htmlFor="company.city" className={labelClassName}>
                City
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.city"
                  name="company.city"
                  value={letterData.insurance?.company?.city || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter city"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="company.state" className={labelClassName}>
                State
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.state"
                  name="company.state"
                  value={letterData.insurance?.company?.state || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="company.zip" className={labelClassName}>
                ZIP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company.zip"
                  name="company.zip"
                  value={letterData.insurance?.company?.zip || ''}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <p className="text-sm text-gray-500">
            Please ensure all required insurance information is accurate for proper claim processing.
          </p>
        </div>
      </div>
    </div>
  );
};