import pool from '../database/database_connection';
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

const ComorbidityService = {
  getComorbidityOfPatient,
  getAllComorbidities
};

export default ComorbidityService;
