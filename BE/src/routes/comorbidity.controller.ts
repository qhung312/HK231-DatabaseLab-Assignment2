import { Router } from 'express';
import _, { toNumber } from 'lodash';

import pool from '../database/database_connection';
import { CustomResponse } from '../types/response';

const comorbidityController = Router();

comorbidityController.get('/', async (req, res: CustomResponse) => {
  try {
    const result = await pool.query('SELECT * FROM comorbidity');
    res.composer.ok(result.rows);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

comorbidityController.get('/:id', async (req, res: CustomResponse) => {
  try {
    const result = await pool.query('SELECT * FROM comorbidity WHERE id = $1', [
      toNumber(req.params.id)
    ]);
    if (_.isEmpty(result)) {
      throw new Error(`No comorbidity with id ${req.params.id} found`);
    }
    res.composer.ok(result.rows[0]);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default comorbidityController;
