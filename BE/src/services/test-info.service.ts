import pool from '../database/database_connection';
import { TestInfo } from '../types/test-info';

async function getAllTestsOfPatientInstance(
  patientId: string,
  instanceId: number
): Promise<TestInfo[]> {
  const { rows } = await pool.query(
    `
    SELECT
      unique_number AS "patientId",
      patient_order AS "patientInstanceOrder",
      test_order AS "testOrder",
      test_timestamp AS "timestamp",
      test_type AS "type",
      spo2_rate AS "spo2Rate",
      result,
      ct_threshold AS "ctThreshold",
      respiratory_bpm AS "respiratoryBpm"
    FROM test_info
    WHERE unique_number=$1 AND patient_order=$2
    `,
    [patientId, instanceId]
  );
  return rows;
}

const TestInfoService = {
  getAllTestsOfPatientInstance
};

export default TestInfoService;
