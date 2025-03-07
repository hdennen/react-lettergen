export interface Product {
  id: string;
  name: string;
  description: string;
  templates: LetterTemplate[];
}

export interface LetterTemplate {
  id: string;
  name: string;
  productId: string;
  isDefault: boolean;
  type: 'medical_necessity' | 'appeal';
  intro: string;
  rationale: string;
  version: string;
  content: string;
}

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  npiNumber: string;
  practiceId: string;
}

export interface Practice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  logo: string;
}

export interface Patient {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface Insurance {
  policyNumber: string;
  groupNumber: string;
  policyHolder: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  company: {
    contactName: string;
    contactTitle: string;
    name: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface Diagnosis {
  icd10Code: string;
  description: string;
  labResults: LabResult[];
  additionalDetails: string;
}

export interface LabResult {
  id: string;
  date: string;
  test: string;
  result: string;
  unit: string;
}

export interface Treatment {
  id: string;
  date: string;
  treatment: string;
  outcome: string;
}

export interface TreatmentHistory {
  treatments: Treatment[];
  conditionDescription: string;
  rationale: string;
}

export interface LetterData {
  template: LetterTemplate | null;
  letterDate: string;
  provider: Provider;
  practice: Practice;
  patient: Patient;
  insurance: Insurance;
  diagnosis: Diagnosis;
  treatmentHistory: TreatmentHistory;
  introduction: string;
  finalRationale: string;
}

export interface User {
  id: string;
  email: string;
}

export interface NPIResponse {
  results: Array<{
    organization_name?: string;
    basic?: {
      first_name?: string;
      last_name?: string;
      credential?: string;
    };
    number: string;
    addresses: Array<{
      address_1: string;
      city: string;
      state: string;
      postal_code: string;
      telephone_number: string;
    }>;
  }>;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  npiNumber: string;
  practiceId?: string;
  profileCompleted?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  npi: string;
  logoUrl?: string;
  locations: Location[];
  providers?: UserProfile[];
}

export interface Location {
  id?: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}