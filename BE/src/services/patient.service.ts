import _ from 'lodash';

import pool from '../database/database_connection';
import { PatientInstance, PatientInfo } from '../types/patient';

async function getAllInstancesOfPatient(patientId: string): Promise<PatientInstance[]> {
  const { rows } = await pool.query(
    `
    SELECT
      unique_number AS "patientId",
      patient_order AS "patientInstanceOrder",
      location_before_admission AS "locationBeforeAdmission",
      admission_time AS "admissionTime",
      is_warning AS "isWarning",
      employee.e_id AS "employeeId",
      employee.e_name AS "name",
      employee.e_type AS "role",
      employee.is_head AS "isHead"
    FROM patient_instance
    JOIN employee ON patient_instance.nurse_assigned=employee.e_id
    WHERE unique_number=$1
    `,
    [patientId]
  );

  const result: PatientInstance[] = _.map(rows, (row) => ({
    ..._.pick(row, [
      'patientId',
      'patientInstanceOrder',
      'locationBeforeAdmission',
      'admissionTime',
      'isWarning'
    ]),
    assignedNurse: _.pick(row, ['employeeId', 'name', 'role', 'isHead'])
  }));

  return result;
}

async function getPatientDemographic(patientId: string): Promise<PatientInfo | null> {
  const { rows } = await pool.query(
    `
  SELECT
    unique_number AS "patientId",
    identity_number AS "identityNumber",
    full_name AS "name",
    gender,
    addr,
    phone
  FROM patient
  WHERE unique_number=$1
  `,
    [patientId]
  );

  if (_.isEmpty(rows)) {
    return null;
  }

  return _.first(rows);
}

const PatientService = {
  getAllInstancesOfPatient,
  getPatientDemographic
};

export default PatientService;
