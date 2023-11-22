import { HasComorbidityInfo } from './comorbidity';

export type PatientSearchResult = {
  id: string;
  name: string;
  phone: string;
  comorbidities: HasComorbidityInfo[];
};
