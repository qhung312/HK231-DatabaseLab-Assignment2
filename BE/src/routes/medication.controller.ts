import { Router } from 'express';
import _ from 'lodash';

import pool from '../database/database_connection';

const medicationController = Router();

medicationController.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medication');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

medicationController.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM medication WHERE id = $1', [id]);
    if (_.isEmpty(result.rows)) {
      throw new Error(`No medication with id ${id} found`);
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default medicationController;
