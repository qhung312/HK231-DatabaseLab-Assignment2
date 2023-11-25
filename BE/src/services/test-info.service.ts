import _ from 'lodash';

import pool from '../database/database_connection';
import { AddPatientInstanceTest } from '../dto/add-patient.dto';
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

async function getPatientInstanceMaxTestOrder(
  patientId: string,
  instanceId: number
): Promise<number> {
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(MAX(test_order)) AS "maxTestOrder"
    FROM test_info
    WHERE unique_number=$1 AND patient_order=$2
    `,
    [patientId, instanceId]
  );
  return _.first(rows).maxTestOrder;
}

async function addPatientInstanceTests(
  patientId: string,
  patientOrder: number,
  tests: AddPatientInstanceTest[]
) {
  if (tests.length > 0) {
    const nextTestOrder = (await getPatientInstanceMaxTestOrder(patientId, patientOrder)) + 1;

    await pool.query(
      `
    INSERT INTO
    test_info(unique_number, patient_order, test_order, test_timestamp, test_type, spo2_rate, result, ct_threshold, respiratory_bpm)
    VALUES ${_.join(
      _.map(
        tests,
        (test, index) =>
          `($${index * 9 + 1}, $${index * 9 + 2}, $${index * 9 + 3}, $${index * 9 + 4}, $${
            index * 9 + 5
          }, $${index * 9 + 6}, $${index * 9 + 7}, $${index * 9 + 8}, $${index * 9 + 9})`
      ),
      ', '
    )}
    `,
      _.flatMap(tests, (test, index) => [
        patientId,
        patientOrder,
        nextTestOrder + index,
        test.timestamp,
        test.type,
        test.spo2Rate ?? null,
        test.result ?? null,
        test.ctThreshold ?? null,
        test.respiratoryBpm ?? null
      ])
    );
  }
}

const TestInfoService = {
  getAllTestsOfPatientInstance,
  addPatientInstanceTests
};

export default TestInfoService;
