import { Router } from 'express';
import _ from 'lodash';

import pool from '../database/database_connection';
import MedicationService from '../services/medication.service';
import { MedicationInfo } from '../types';
import { CustomResponse } from '../types/response';

const medicationController = Router();

medicationController.get('/', async (req, res: CustomResponse) => {
  try {
    const medications = await MedicationService.getAllMedications();
    res.composer.ok(medications);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

medicationController.get('/search', async (req, res: CustomResponse) => {
  try {
    const { name, id } = req.query;

    if (!name && !id) {
      throw new Error('No query parameter found');
    }
    type MedicationQuery = {
      queryString: string;
      value: string;
    };

    const queries: MedicationQuery[] = [];
    if (name) {
      queries.push({
        queryString: `medication.medication_name=$${queries.length + 1}`,
        value: decodeURIComponent(name as string)
      });
    }
    if (id) {
      queries.push({
        queryString: `medication.medication_id=$${queries.length + 1}`,
        value: id as string
      });
    }

    const { rows, rowCount } = await pool.query(
      `
    SELECT medication.medication_id AS "medId",
      medication.medication_name AS "medName",
      medication.exp_date AS "expiredDate",
      medication.price::numeric AS "price",
      medication_effect.medication_effect_id AS "medEffectId",
      medication_effect.effect AS "medEffect"
    FROM medication
    LEFT JOIN medication_effect ON medication.medication_id = medication_effect.medication_id
    ${queries.length > 0 ? `WHERE ${_.join(_.map(queries, 'queryString'), ' AND ')}` : ''}
    `,
      _.map(queries, (option) => option.value)
    );

    const errorMessage = name
      ? `Medication with name ${name} not found`
      : `Medication with id ${id} not found`;

    if (rowCount === 0) {
      throw new Error(errorMessage);
    }

    const firstValue = _.first(rows);

    const result: MedicationInfo = {
      ..._.pick(firstValue, ['medId', 'medName', 'expiredDate', 'price']),
      effects: _.map(
        _.filter(rows, (value) => !_.isNil(value.medEffectId)),
        (value) => _.pick(value, ['medEffectId', 'medEffect'])
      )
    };

    res.composer.ok(result);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default medicationController;
