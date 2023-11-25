import { IsArray, IsNotEmpty } from 'class-validator';

import {
  AddPatientInstanceSymptom,
  AddPatientInstanceTest,
  AddPatientInstanceTreatment,
  AddPatientInstanceCaretaker as AddPatientCaretaker
} from './add-patient.dto';

export default class AddPatientInstanceDto {
  @IsNotEmpty()
  locationBeforeAdmission: string;

  @IsArray()
  symptoms: AddPatientInstanceSymptom[];

  @IsArray()
  treatments: AddPatientInstanceTreatment[];

  @IsArray()
  tests: AddPatientInstanceTest[];

  @IsArray()
  careTakers: AddPatientCaretaker[];
}
