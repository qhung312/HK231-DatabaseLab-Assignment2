import { HasComorbidityInfo } from './comorbidity';
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
