import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import express from 'express';
import session from 'express-session';

import pool from './database/database_connection';
import authMiddleware from './middlewares';
import {
  comorbidityController,
  symptomController,
  medicationController,
  patientController,
  authController,
  employeeController,
  meController
} from './routes/index';
import { applyHttpComposer } from './types/response';

const app = express();
const pgSession = connectPgSimple(session);

app.use(applyHttpComposer);
app.use(express.json());
app.use(cors());
app.use(
  session({
    // eslint-disable-next-line new-cap
    store: new pgSession({
      pool,
      tableName: 'session'
    }),
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000
    }
  })
);

app.use('/auth', authController);
app.use('/me', meController);

// ROUTES - Must be authenticated
app.all('*', authMiddleware);
app.use('/symptom', symptomController);
app.use('/comorbidity', comorbidityController);
app.use('/medication', medicationController);
app.use('/patient', patientController);
app.use('/employee', employeeController);

const PORT = 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
