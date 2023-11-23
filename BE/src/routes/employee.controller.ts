import { Request, Router } from 'express';
import _ from 'lodash';

import pool from '../database/database_connection';
import { CustomResponse } from '../types';

const employeeController = Router();

employeeController.get('/', async (req: Request, res: CustomResponse) => {
  try {
    type EmployeeQuery = {
      queryString: string;
      value: string;
    };
    const queries: EmployeeQuery[] = [];
    if (req.query.name) {
      queries.push({
        queryString: `e_name=$${queries.length + 1}`,
        value: decodeURIComponent(req.query.name as string)
      });
    }
    if (req.query.id) {
      queries.push({
        queryString: `e_id=$${queries.length + 1}`,
        value: req.query.id as string
      });
    }
    if (req.query.role) {
      queries.push({
        queryString: `e_type=$${queries.length + 1}`,
        value: req.query.role as string
      });
    }

    const { rows } = await pool.query(
      `
    SELECT
      e_id AS "employeeId",
      e_name AS "name",
      e_type AS "role",
      is_head AS "isHead"
    FROM employee
    ${queries.length > 0 ? `WHERE ${_.join(_.map(queries, 'queryString'), ' AND ')}` : ''}
    `,
      _.map(queries, (option) => option.value)
    );

    res.composer.ok(rows);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default employeeController;
