import { Router } from 'express';
import _ from 'lodash';

import pool from '../database/database_connection';
import { MedicationInfo } from '../types';
import { CustomResponse } from '../types/response';

const medicationController = Router();

medicationController.get('/', async (req, res: CustomResponse) => {
  try {
    const result = await pool.query(`
    SELECT medication.medication_id AS "medId",
      medication.medication_name AS "medName",
      medication.exp_date AS "expiredDate",
      medication.price::numeric AS "price",
      medication_effect.medication_effect_id AS "medEffectId",
      medication_effect.effect AS "medEffect"
    FROM medication
    LEFT JOIN medication_effect ON medication.medication_id = medication_effect.medication_id
    `);

    const groupedResult = _.groupBy(result.rows, 'medId');

    const medications: MedicationInfo[] = _.map(Object.keys(groupedResult), (medicationId) => {
      const values = groupedResult[medicationId];
      const firstValue = _.first(values);

      return {
        ..._.pick(firstValue, ['medId', 'medName', 'expiredDate', 'price']),
        effects: _.map(
          _.filter(values, (value) => !_.isNil(value.medEffectId)),
          (value) => _.pick(value, ['medEffectId', 'medEffect'])
        )
      };
    });

    res.composer.ok(medications);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

medicationController.get('/:medId', async (req, res: CustomResponse) => {
  try {
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
    WHERE medication.medication_id=$1
    `,
      [req.params.medId]
    );

    if (rowCount === 0) {
      throw new Error(`Medication with id ${req.params.medId} not found`);
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
