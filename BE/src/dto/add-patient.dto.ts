import { IsArray, IsNotEmpty } from 'class-validator';

import { MedicationInfo } from '../types';

export type AddPatientDemographicInfo = {
  // identity_number
  id: string;

  name: string;
  gender: 'Male' | 'Female';
  address: string;
  phone: string;
};

export type AddPatientComorbidityInfo = {
  comorbidityId: string;
  seriousness: string;
};

export type AddPatientInstanceSymptom = {
  symptomId: string;
  periods: {
    seriousness: string;
    startDate: string;
    endDate: string;
  }[];
};

export type AddPatientInstanceTreatment = {
  doctorId: string;
  startDate: string;
  endDate: string;
  result: string;
  // id of medications
  medications: MedicationInfo[];
};

export type AddPatientInstanceTest = {
  type: string;
  spo2Rate?: number;
  result?: boolean;
  ctThreshold?: number;
  respiratoryBpm?: number;

  timestamp?: string;
};

export type AddPatientInstanceCaretaker = {
  id: string;
  role: 'Nurse' | 'Volunteer';
};

export class AddPatientDto {
  @IsNotEmpty()
  locationBeforeAdmission: string;

  @IsNotEmpty()
  demographic: AddPatientDemographicInfo;

  @IsArray()
  comorbidities: AddPatientComorbidityInfo[];

  @IsArray()
  symptoms: AddPatientInstanceSymptom[];

  @IsArray()
  treatments: AddPatientInstanceTreatment[];

  @IsArray()
  tests: AddPatientInstanceTest[];

  @IsArray()
  careTakers: AddPatientInstanceCaretaker[];
}
