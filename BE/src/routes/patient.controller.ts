import { Router } from 'express';
import _, { toNumber } from 'lodash';

import pool from '../database/database_connection';
import AddPatientInstanceDto from '../dto/add-patient-instance.dto';
import { AddPatientDto } from '../dto/add-patient.dto';
import customValidateOrReject from '../lib/custom-validate-reject';
import ComorbidityService from '../services/comorbidity.service';
import PatientService from '../services/patient.service';
import SymptomService from '../services/symptom.service';
import TestInfoService from '../services/test-info.service';
import TreatmentInfoService from '../services/treatment-info.service';
import { CustomResponse, PatientSearchResult } from '../types/index';
import { PatientReportInfo } from '../types/patient';

const patientController = Router();

patientController.get('/', async (req, res: CustomResponse) => {
  try {
    type PatientQueryOptions = {
      queryString: string;
      value: string;
    };

    const queryOptions: PatientQueryOptions[] = [];
    if (req.query.name) {
      queryOptions.push({
        queryString: `patient.full_name=$${queryOptions.length + 1}`,
        value: decodeURIComponent(req.query.name as string)
      });
    }
    if (req.query.phone) {
      queryOptions.push({
        queryString: `patient.phone=$${queryOptions.length + 1}`,
        value: req.query.phone as string
      });
    }
    if (req.query.id) {
      queryOptions.push({
        queryString: `patient.identity_number=$${queryOptions.length + 1}`,
        value: req.query.id as string
      });
    }

    const { rows } = await pool.query(
      `
    SELECT
      patient.unique_number AS "id",
      patient.full_name AS "name",
      patient.phone AS "phone",
      comorbidity.c_id AS "comorbidityId",
      comorbidity.c_description AS "description",
      has_comorbidity.seriousness AS "seriousness"
    FROM patient
    LEFT JOIN has_comorbidity ON patient.unique_number=has_comorbidity.unique_number
    LEFT JOIN comorbidity ON has_comorbidity.c_id=comorbidity.c_id
    ${queryOptions.length > 0 ? `WHERE ${_.join(_.map(queryOptions, 'queryString'), ' AND ')}` : ''}
    `,
      _.map(queryOptions, (option) => option.value)
    );

    const groupedResult = _.groupBy(rows, 'id');

    const patients: PatientSearchResult[] = _.map(Object.keys(groupedResult), (id) => {
      const values = groupedResult[id];
      const firstValue = _.first(values);

      return {
        ..._.pick(firstValue, ['id', 'name', 'phone']),
        comorbidities: _.map(
          _.filter(values, (value) => !_.isNil(value.comorbidityId)),
          (value) => _.pick(value, ['comorbidityId', 'description', 'seriousness'])
        )
      };
    });

    res.composer.ok(patients);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

patientController.get(
  '/:patientId/instance/:instanceId/tests',
  async (req, res: CustomResponse) => {
    try {
      const { patientId } = req.params;
      const instanceId = toNumber(req.params.instanceId);

      if (_.isNil(patientId)) {
        throw new Error('Patient id is required');
      }

      if (_.isNil(instanceId)) {
        throw new Error('Patient instance id is required');
      }

      const result = await TestInfoService.getAllTestsOfPatientInstance(patientId, instanceId);

      res.composer.ok(result);
    } catch (error) {
      res.composer.badRequest(error.message);
    }
  }
);

patientController.get(
  '/:patientId/instance/:instanceId/report',
  async (req, res: CustomResponse) => {
    try {
      const { patientId } = req.params;
      const instanceId = toNumber(req.params.instanceId);

      if (_.isNil(patientId)) {
        throw new Error('Patient id is required');
      }

      if (_.isNil(instanceId)) {
        throw new Error('Patient instance id is required');
      }

      const [symptoms, comorbidities, testInfos, treatments] = await Promise.all([
        SymptomService.getPatientInstanceSymptoms(patientId, instanceId),
        ComorbidityService.getComorbidityOfPatient(patientId),
        TestInfoService.getAllTestsOfPatientInstance(patientId, instanceId),
        TreatmentInfoService.getAllTreatmentOfPatientInstance(patientId, instanceId)
      ]);

      const result: PatientReportInfo = {
        symptomsInfo: symptoms,
        comorbidityInfo: comorbidities,
        testInfo: testInfos,
        treatmentInfo: treatments
      };

      res.composer.ok({ reportInfo: result });
    } catch (error) {
      res.composer.badRequest(error.message);
    }
  }
);

patientController.get('/:patientId/instance', async (req, res: CustomResponse) => {
  try {
    const { patientId } = req.params;
    if (_.isNil(patientId)) {
      throw new Error('Patient id is required');
    }

    const instances = await PatientService.getAllInstancesOfPatient(patientId);

    res.composer.ok({ instanceInfo: instances });
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

patientController.get('/:patientId', async (req, res: CustomResponse) => {
  try {
    const { patientId } = req.params;
    if (_.isNil(patientId)) {
      throw new Error('Patient id is required');
    }

    const patientInfo = await PatientService.getPatientDemographic(patientId);

    if (_.isNil(patientInfo)) {
      throw new Error('Patient not found');
    }

    res.composer.ok({ demographicInfo: patientInfo });
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

patientController.post('/', async (req, res: CustomResponse) => {
  try {
    const info = new AddPatientDto();
    info.demographic = req.body.demographic;
    info.locationBeforeAdmission = req.body.locationBeforeAdmission;
    info.comorbidities = req.body.comorbidities;
    info.symptoms = req.body.symptoms;
    info.treatments = req.body.treatments;
    info.tests = req.body.tests;
    info.careTakers = req.body.careTakers;

    await customValidateOrReject(info);

    const sameUser = await PatientService.getPatientByIdentityNumber(info.demographic.id);

    if (!_.isNil(sameUser)) {
      throw new Error('Patient already exists');
    }

    const result = await PatientService.addPatient(info);
    res.composer.ok({ success: true, patientId: result });
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

patientController.post('/:patientId/instance', async (req, res: CustomResponse) => {
  try {
    const { patientId } = req.params;
    if (_.isNil(patientId)) {
      throw new Error('Patient id is required');
    }

    const info = new AddPatientInstanceDto();
    info.locationBeforeAdmission = req.body.locationBeforeAdmission;
    info.symptoms = req.body.symptoms;
    info.treatments = req.body.treatments;
    info.tests = req.body.tests;
    info.careTakers = req.body.careTakers;

    await customValidateOrReject(info);

    const sameUser = await PatientService.getPatientByUniqueIdentifier(patientId);
    if (_.isNil(sameUser)) {
      throw new Error('Patient not found');
    }

    const result = await PatientService.addPatientInstance(patientId, info);
    res.composer.ok({ success: true, patientId, patientInstanceOrder: result });
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default patientController;
