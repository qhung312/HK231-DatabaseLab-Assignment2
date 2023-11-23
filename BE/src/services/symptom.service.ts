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
    has_symptom.seriousness AS "seriousness",
    symptom.s_description AS "description"
  FROM has_symptom
  JOIN symptom ON has_symptom.s_id=symptom.s_id
  WHERE has_symptom.unique_number=$1 AND has_symptom.patient_order=$2;
  `,
    [patientId, instanceId]
  );

  return rows;
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
