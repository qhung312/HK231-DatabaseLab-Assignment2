import { Request, Router } from 'express';

import pool from '../database/database_connection';
import { CustomResponse } from '../types';

const employeeController = Router();

employeeController.get('/', async (req: Request, res: CustomResponse) => {
  try {
    const { rows } = await pool.query(
      `
    SELECT
      e_id AS "employeeId",
      e_name AS "name",
      e_type AS "role",
      is_head AS "isHead"
    FROM employee
    ${req.query.role ? 'WHERE is_head = $1' : ''}
    `,
      req.query.role ? [req.query.role] : []
    );

    res.composer.ok(rows);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default employeeController;
