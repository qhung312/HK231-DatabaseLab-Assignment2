import _ from 'lodash';

import pool from '../database/database_connection';
import { AddPatientComorbidityInfo } from '../dto/add-patient.dto';
import { HasComorbidityInfo } from '../types/comorbidity';

async function getComorbidityOfPatient(patientId: string): Promise<HasComorbidityInfo[]> {
  const { rows } = await pool.query(
    `
    SELECT
      has_comorbidity.c_id AS "comorbidityId",
      comorbidity.c_description AS "description",
      has_comorbidity.seriousness AS "seriousness"
    FROM has_comorbidity
    JOIN comorbidity ON has_comorbidity.c_id=comorbidity.c_id
    WHERE unique_number=$1;
    `,
    [patientId]
  );
  return rows;
}

async function getAllComorbidities(): Promise<HasComorbidityInfo[]> {
  const { rows } = await pool.query(`
    SELECT
      c_id AS "comorbidityId",
      c_description AS "description"
    FROM comorbidity
    `);
  return rows;
}

async function addPatientComorbidities(
  patientId: string,
  comorbidities: AddPatientComorbidityInfo[]
) {
  if (comorbidities.length > 0) {
    await pool.query(
      `
    INSERT INTO has_comorbidity(unique_number, c_id, seriousness)
    VALUES ${_.join(
      _.map(
        comorbidities,
        (comor, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      ),
      ', '
    )}
    `,
      _.flatMap(comorbidities, (comor) => [patientId, comor.comorbidityId, comor.seriousness])
    );
  }
}

const ComorbidityService = {
  getComorbidityOfPatient,
  getAllComorbidities,
  addPatientComorbidities
};

export default ComorbidityService;
