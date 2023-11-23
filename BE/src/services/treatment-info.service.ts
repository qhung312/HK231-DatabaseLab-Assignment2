import _ from 'lodash';

import pool from '../database/database_connection';
import { MedicationInfo } from '../types';
import { TreatmentInfo } from '../types/treatment';

import MedicationService from './medication.service';

async function getAllMedicationsOfTreatment(
  patientId: string,
  instanceId: number,
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<MedicationInfo[]> {
  const { rows } = await pool.query(
    `
  SELECT
    medication.medication_id AS "medId",
    medication.medication_name AS "medName",
    medication.exp_date AS "expiredDate",
    medication.price::numeric AS "price"
  FROM treats
  JOIN medication_in_treatment ON (treats.unique_number, treats.patient_order, treats.e_id, treats.start_time, treats.end_time)=
  (medication_in_treatment.unique_number, medication_in_treatment.patient_order, medication_in_treatment.e_id, medication_in_treatment.start_time, medication_in_treatment.end_time)
  JOIN medication ON medication_in_treatment.medication_id=medication.medication_id
  WHERE treats.unique_number=$1 AND treats.patient_order=$2 AND treats.e_id=$3 AND treats.start_time=$4 AND treats.end_time=$5
  `,
    [patientId, instanceId, doctorId, startDate, endDate]
  );

  return await Promise.all(
    _.map(rows, (row) =>
      (async () => {
        const effects = await MedicationService.getEffectsOfMedication(row.medId);
        return {
          ..._.pick(row, ['medId', 'medName', 'expiredDate', 'price']),
          effects
        };
      })()
    )
  );
}

async function getAllTreatmentOfPatientInstance(
  patientId: string,
  instanceId: number
): Promise<TreatmentInfo[]> {
  const { rows } = await pool.query(
    `
  SELECT
    unique_number AS "patientId",
    patient_order AS "patientInstanceOrder",
    treats.e_id AS "employeeId",
    employee.e_name AS "name",
    employee.e_type AS "role",
    employee.is_head AS "isHead",
    result,
    start_time AS "startDate",
    end_time AS "endDate"
  FROM treats
  JOIN employee ON treats.e_id=employee.e_id
  WHERE unique_number=$1 AND patient_order=$2
  `,
    [patientId, instanceId]
  );

  return await Promise.all(
    _.map(rows, (row) =>
      (async () => {
        const medications = await getAllMedicationsOfTreatment(
          patientId,
          instanceId,
          row.employeeId,
          row.startDate,
          row.endDate
        );
        return {
          ..._.pick(row, ['patientId', 'patientInstanceOrder', 'result', 'startDate', 'endDate']),
          medications,
          doctor: _.pick(row, ['employeeId', 'name', 'role', 'isHead'])
        };
      })()
    )
  );
}

const TreatmentInfoService = {
  getAllTreatmentOfPatientInstance
};

export default TreatmentInfoService;
