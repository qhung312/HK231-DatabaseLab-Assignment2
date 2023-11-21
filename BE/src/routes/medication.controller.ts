import { Router } from 'express';
import _ from 'lodash';

import pool from '../database/database_connection';
import { CustomResponse } from '../types/response';

const medicationController = Router();

medicationController.get('/', async (req, res: CustomResponse) => {
  try {
    const result = await pool.query('SELECT * FROM medication');
    res.composer.ok(result.rows);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

medicationController.get('/:id', async (req, res: CustomResponse) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM medication WHERE id = $1', [id]);
    if (_.isEmpty(result.rows)) {
      throw new Error(`No medication with id ${id} found`);
    }
    res.composer.ok(result.rows[0]);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default medicationController;
