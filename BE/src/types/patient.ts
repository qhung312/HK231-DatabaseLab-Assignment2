import { HasComorbidityInfo } from './comorbidity';
import { EmployeeInfo } from './employee';
import { HasSymptomInfo } from './symptom';
import { TestInfo } from './test-info';
import { TreatmentInfo } from './treatment';

export type PatientSearchResult = {
  id: string;
  name: string;
  phone: string;
  comorbidities: HasComorbidityInfo[];
};

export type PatientReportInfo = {
  symptomsInfo: HasSymptomInfo[];
  comorbidityInfo: HasComorbidityInfo[];
  testInfo: TestInfo[];
  treatmentInfo: TreatmentInfo[];
};

export type PatientInstance = {
  patientId: string;
  patientInstanceOrder: number;
  locationBeforeAdmission: string;
  assignedNurse: EmployeeInfo;
  admissionTime: string;
  isWarning: boolean;
};

export type PatientInfo = {
  patientId: string;
  identityNumber: string;
  name: string;
  gender: 'Male' | 'Female';
  address: string;
  phone: string;
};
