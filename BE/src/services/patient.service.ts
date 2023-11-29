import _, { toNumber } from 'lodash';

import pool from '../database/database_connection';
import AddPatientInstanceDto from '../dto/add-patient-instance.dto';
import { AddPatientDto } from '../dto/add-patient.dto';
import { PatientInstance, PatientInfo } from '../types/patient';

import ComorbidityService from './comorbidity.service';
import SymptomService from './symptom.service';
import TestInfoService from './test-info.service';
import TreatmentInfoService from './treatment-info.service';

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

async function getPatientByUniqueNumber(patientId: string): Promise<PatientInfo | null> {
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

async function getPatientByIdentityNumber(identityNumber: string): Promise<PatientInfo | null> {
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
  WHERE identity_number=$1
  `,
    [identityNumber]
  );

  if (_.isEmpty(rows)) {
    return null;
  }

  return _.first(rows);
}

async function getPatientByUniqueIdentifier(uniqueIdentifier: string): Promise<PatientInfo | null> {
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
    [uniqueIdentifier]
  );

  if (_.isEmpty(rows)) {
    return null;
  }

  return _.first(rows);
}

async function getMaximumOrderOfPatient(patientId: string): Promise<number> {
  const { rows } = await pool.query(
    `
  SELECT COALESCE(MAX(patient_order), 0) AS "maxPatientOrder"
  FROM patient_instance
  WHERE unique_number=$1
  `,
    [patientId]
  );

  return _.first(rows).maxPatientOrder;
}

async function getMaxPatientId(): Promise<number> {
  const { rows } = await pool.query(
    `
  SELECT unique_number AS "patientId"
  FROM patient
  `
  );

  if (_.isEmpty(rows)) {
    return 0;
  }

  return _.max(_.map(rows, (row) => toNumber(row.patientId)));
}

async function addPatientInstance(patientId: string, info: AddPatientInstanceDto) {
  const patientOrder = (await getMaximumOrderOfPatient(patientId)) + 1;

  console.assert(info.careTakers.length === 1 && _.first(info.careTakers).role === 'Nurse');
  const { id: nurseId } = _.first(info.careTakers);
  const { locationBeforeAdmission } = info;

  // insert patient instance
  await pool.query(
    `
  INSERT INTO patient_instance
  (unique_number, patient_order, location_before_admission, admission_time, nurse_assigned)
  VALUES ($1, $2, $3, NOW(), $4)
  `,
    [patientId, patientOrder, locationBeforeAdmission, nurseId]
  );

  // insert other informations
  await Promise.all([
    SymptomService.addPatientInstanceSymptoms(patientId, patientOrder, info.symptoms),
    TreatmentInfoService.addPatientInstanceTreatment(patientId, patientOrder, info.treatments),
    TestInfoService.addPatientInstanceTests(patientId, patientOrder, info.tests)
  ]);

  return patientOrder;
}

async function addPatient(info: AddPatientDto) {
  // add the new user
  const newPatientId = ((await getMaxPatientId()) + 1).toString();
  console.log(newPatientId);
  const { id, name, gender, address, phone } = info.demographic;
  await pool.query(
    `
  INSERT INTO patient (unique_number, identity_number, full_name, gender, addr, phone)
  VALUES ($1, $2, $3, $4, $5, $6)
  `,
    [newPatientId, id, name, gender, address, phone]
  );

  await Promise.all([
    addPatientInstance(newPatientId, {
      locationBeforeAdmission: info.locationBeforeAdmission,
      careTakers: info.careTakers,
      symptoms: info.symptoms,
      treatments: info.treatments,
      tests: info.tests
    }),
    ComorbidityService.addPatientComorbidities(newPatientId, info.comorbidities)
  ]);

  return newPatientId;
}

const PatientService = {
  getAllInstancesOfPatient,
  getPatientDemographic: getPatientByUniqueNumber,
  getPatientByIdentityNumber,
  addPatient,
  addPatientInstance,
  getPatientByUniqueIdentifier
};

export default PatientService;
