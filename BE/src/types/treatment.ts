import { EmployeeInfo } from './employee';
import { MedicationInfo } from './medication';

export type TreatmentInfo = {
  doctor: EmployeeInfo;
  patientId: string;
  patientInstanceOrder: number;
  result: string;
  startDate: string;
  endDate: string;

  medications: MedicationInfo[];
};
