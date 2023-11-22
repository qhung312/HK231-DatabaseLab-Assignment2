import connectPgSimple from 'connect-pg-simple';
import express from 'express';
import session from 'express-session';

import pool from './database/database_connection';
import authMiddleware from './middlewares';
import {
  comorbidityController,
  symptomController,
  medicationController,
  patientController,
  authController
} from './routes/index';
import { applyHttpComposer } from './types/response';

const app = express();
const pgSession = connectPgSimple(session);

app.use(applyHttpComposer);
app.use(express.json());
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

// ROUTES - Must be authenticated
app.all('*', authMiddleware);
app.use('/symptom', symptomController);
app.use('/comorbidity', comorbidityController);
app.use('/medication', medicationController);
app.use('/patient', patientController);

const PORT = 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
