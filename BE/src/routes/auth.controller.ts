import bcrypt from 'bcrypt';
import { Router } from 'express';
import _ from 'lodash';

import pool from '../database/database_connection';
import { CustomResponse } from '../types';

const authController = Router();

authController.post('/login', async (req, res: CustomResponse) => {
  try {
    const { username, password } = req.body;

    if (_.isNil(username) || _.isEmpty(username)) {
      throw new Error('Username is required');
    }

    if (_.isNil(password) || _.isEmpty(password)) {
      throw new Error('Password is required');
    }

    const { rows } = await pool.query('SELECT * FROM account WHERE username = $1', [username]);

    if (rows.length === 0) {
      throw new Error('Account not found');
    }

    const account = _.first(rows);
    const passwordsMatch = await bcrypt.compare(password, account.passwd);

    if (!passwordsMatch) {
      throw new Error('Password is incorrect');
    }

    _.set(req.session, 'username', account.username);

    res.composer.ok({ employeeId: account.e_id, username: account.username });
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

authController.post('/signup', async (req, res: CustomResponse) => {
  try {
    const { username, password, employeeId } = req.body;

    if (_.isNil(username) || _.isEmpty(username)) {
      throw new Error('Username is required');
    }

    if (_.isNil(password) || _.isEmpty(password)) {
      throw new Error('Password is required');
    }

    if (_.isNil(employeeId)) {
      throw new Error('Employee ID is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO account (username, passwd, e_id) VALUES ($1, $2, $3)', [
      username,
      hashedPassword,
      employeeId
    ]);

    res.composer.ok(`Account '${username}' created`);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

authController.post('/logout', async (req, res: CustomResponse) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw new Error(err.message);
      }
    });

    res.composer.ok('Logged out');
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

authController.get('/session', async (req, res: CustomResponse) => {
  try {
    const username = _.get(req.session, 'username');
    if (username) {
      res.composer.ok({ userInfo: { username } });
    } else {
      res.composer.ok({ error: `You're not logged in` });
    }
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default authController;
