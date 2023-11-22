import { Router } from 'express';

import pool from '../database/database_connection';
import { CustomResponse } from '../types/response';

const comorbidityController = Router();

comorbidityController.get('/', async (req, res: CustomResponse) => {
  try {
    const { rows } = await pool.query(`
    SELECT
      c_id AS "comorbidityId",
      c_description AS "description"
    FROM comorbidity
    `);

    res.composer.ok(rows);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default comorbidityController;
