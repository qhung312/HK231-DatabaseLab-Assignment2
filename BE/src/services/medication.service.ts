import _ from 'lodash';

import pool from '../database/database_connection';
import { MedicationEffect, MedicationInfo } from '../types';

async function getAllMedications(): Promise<MedicationInfo[]> {
  const result = await pool.query(`
    SELECT medication.medication_id AS "medId",
      medication.medication_name AS "medName",
      medication.exp_date AS "expiredDate",
      medication.price::numeric AS "price",
      medication_effect.medication_effect_id AS "medEffectId",
      medication_effect.effect AS "medEffect"
    FROM medication
    LEFT JOIN medication_effect ON medication.medication_id = medication_effect.medication_id
    `);

  const groupedResult = _.groupBy(result.rows, 'medId');

  const medications: MedicationInfo[] = _.map(Object.keys(groupedResult), (medicationId) => {
    const values = groupedResult[medicationId];
    const firstValue = _.first(values);

    return {
      ..._.pick(firstValue, ['medId', 'medName', 'expiredDate', 'price']),
      effects: _.map(
        _.filter(values, (value) => !_.isNil(value.medEffectId)),
        (value) => _.pick(value, ['medEffectId', 'medEffect'])
      )
    };
  });

  return medications;
}

async function getEffectsOfMedication(medicationId: string): Promise<MedicationEffect[]> {
  const { rows } = await pool.query(
    `
    SELECT medication_effect.medication_effect_id AS "medEffectId",
      medication_effect.effect AS "medEffect"
    FROM medication_effect
    WHERE medication_effect.medication_id=$1
    `,
    [medicationId]
  );

  return rows;
}

async function addMedicationInTreatment(
  patientId: string,
  patientOrder: number,
  employeeId: string,
  startDate: string,
  endDate: string,
  medicationIds: string[]
) {
  if (medicationIds.length > 0) {
    await pool.query(
      `
    INSERT INTO
    medication_in_treatment(unique_number, patient_order, e_id, start_time, end_time, medication_id)
    VALUES ${_.join(
      _.map(
        medicationIds,
        (medId, index) =>
          `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${
            index * 6 + 5
          }, $${index * 6 + 6})`
      ),
      ', '
    )}
    `,
      _.flatMap(medicationIds, (medId) => [
        patientId,
        patientOrder,
        employeeId,
        startDate,
        endDate,
        medId
      ])
    );
  }
}

const MedicationService = {
  getAllMedications,
  getEffectsOfMedication,
  addMedicationInTreatment
};

export default MedicationService;
