import _ from 'lodash';

import pool from '../database/database_connection';
import { AddPatientInstanceSymptom } from '../dto/add-patient.dto';
import { HasSymptomInfo, SymptomInfo } from '../types';

async function getPatientInstanceSymptoms(
  patientId: string,
  instanceId: number
): Promise<HasSymptomInfo[]> {
  const { rows } = await pool.query(
    `
    SELECT
      symptom_period.s_id AS "symptomId",
      symptom.s_description AS "description",
      symptom_period.start_date AS "startDate",
      symptom_period.end_date AS "endDate",
      symptom_period.seriousness AS "seriousness"
    FROM symptom_period
    JOIN symptom ON symptom_period.s_id=symptom.s_id
    WHERE (symptom_period.unique_number, symptom_period.patient_order)=($1, $2);
  `,
    [patientId, instanceId]
  );

  const groupedResult = _.groupBy(rows, 'symptomId');

  const result: HasSymptomInfo[] = _.map(groupedResult, (periods) => {
    const firstValue = _.first(periods);

    return {
      ..._.pick(firstValue, ['symptomId', 'description']),
      periods: _.map(periods, (period) => _.pick(period, ['seriousness', 'startDate', 'endDate']))
    };
  });

  return result;
}

async function getAllSymptoms(): Promise<SymptomInfo[]> {
  const { rows } = await pool.query(`
    SELECT
      s_id AS "symptomId",
      s_description AS "description"
    FROM symptom
    `);
  return rows;
}

async function addPatientInstanceSymptoms(
  patientId: string,
  instanceId: number,
  symptoms: AddPatientInstanceSymptom[]
) {
  if (symptoms.length > 0) {
    // insert has_symptom
    await pool.query(
      `
    INSERT INTO has_symptom(unique_number, patient_order, s_id)
    VALUES ${_.join(
      _.map(symptoms, (symp, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`),
      ', '
    )}
    `,
      _.flatMap(symptoms, (symp) => [patientId, instanceId, symp.symptomId])
    );

    // insert symptom_period
    await Promise.all(
      _.flatMap(symptoms, (symptom) =>
        _.map(symptom.periods, (period) =>
          (async () => {
            await pool.query(
              `
            INSERT INTO symptom_period(unique_number, patient_order, s_id, start_date, end_date, seriousness)
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
              [
                patientId,
                instanceId,
                symptom.symptomId,
                period.startDate,
                period.endDate,
                period.seriousness
              ]
            );
          })()
        )
      )
    );
  }
}

const SymptomService = {
  getPatientInstanceSymptoms,
  getAllSymptoms,
  addPatientInstanceSymptoms
};

export default SymptomService;
