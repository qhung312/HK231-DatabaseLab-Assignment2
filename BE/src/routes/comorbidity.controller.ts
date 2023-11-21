import { Router } from 'express';
import { toNumber } from 'lodash';

import pool from '../database/database_connection';

const comorbidityController = Router();

comorbidityController.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comorbidity');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json(`Error: ${error}`);
  }
});

comorbidityController.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comorbidity WHERE id = $1', [
      toNumber(req.params.id)
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json(`Error: ${error}`);
  }
});

export default comorbidityController;
