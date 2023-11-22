import { Router } from 'express';

import pool from '../database/database_connection';
import { CustomResponse } from '../types/response';

const symptomController = Router();

symptomController.get('/', async (req, res: CustomResponse) => {
  try {
    const { rows } = await pool.query(`
    SELECT
      s_id AS "symptomId",
      s_description AS "description"
    FROM symptom
    `);

    res.composer.ok(rows);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default symptomController;
