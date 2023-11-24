import _ from 'lodash';

import pool from '../database/database_connection';
import { AddPatientInstanceTreatment } from '../dto/add-patient.dto';
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

async function addPatientInstanceTreatment(
  patientId: string,
  patientOrder: number,
  treatments: AddPatientInstanceTreatment[]
) {
  if (treatments.length > 0) {
    await pool.query(
      `
    INSERT INTO treats(unique_number, patient_order, e_id, result, start_time, end_time)
    VALUES ${_.join(
      _.map(
        treatments,
        (treatment, index) =>
          `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${
            index * 6 + 5
          }, $${index * 6 + 6})`
      ),
      ', '
    )}
    `,
      _.flatMap(treatments, (treatment) => [
        patientId,
        patientOrder,
        treatment.doctorId,
        treatment.result,
        treatment.startDate,
        treatment.endDate
      ])
    );

    // add the medications used for this treatment
    await Promise.all(
      _.map(treatments, (treatment) =>
        MedicationService.addMedicationInTreatment(
          patientId,
          patientOrder,
          treatment.doctorId,
          treatment.startDate,
          treatment.endDate,
          treatment.medications
        )
      )
    );
  }
}

const TreatmentInfoService = {
  getAllTreatmentOfPatientInstance,
  addPatientInstanceTreatment
};

export default TreatmentInfoService;
