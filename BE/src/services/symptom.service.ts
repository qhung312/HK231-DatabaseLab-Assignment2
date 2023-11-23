import _ from 'lodash';

import pool from '../database/database_connection';
import { HasSymptomInfo, SymptomInfo } from '../types';

async function getPatientInstanceSymptoms(
  patientId: string,
  instanceId: number
): Promise<HasSymptomInfo[]> {
  const { rows } = await pool.query(
    `
  SELECT
    has_symptom.s_id AS "symptomId",
    symptom.s_description AS "description",
    symptom_period.seriousness AS "seriousness",
    symptom_period.start_date AS "startDate",
    symptom_period.end_date AS "endDate"
  FROM has_symptom
  JOIN symptom ON has_symptom.s_id=symptom.s_id
  LEFT JOIN symptom_period ON (has_symptom.s_id, has_symptom.unique_number, has_symptom.patient_order)=
  (symptom_period.s_id, symptom_period.unique_number, symptom_period.patient_order)
  WHERE has_symptom.unique_number=$1 AND has_symptom.patient_order=$2;
  `,
    [patientId, instanceId]
  );

  const groupedValues = _.groupBy(rows, 'symptomId');

  const result: HasSymptomInfo[] = _.map(Object.keys(groupedValues), (symptomId) => {
    const values = groupedValues[symptomId];
    const firstValue = _.first(values);

    return {
      ..._.pick(firstValue, ['symptomId', 'description']),
      periods: _.map(
        _.filter(values, (value) => !_.isNil(value.startDate)),
        (value) => _.pick(value, ['seriousness', 'startDate', 'endDate'])
      )
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

const SymptomService = {
  getPatientInstanceSymptoms,
  getAllSymptoms
};

export default SymptomService;
