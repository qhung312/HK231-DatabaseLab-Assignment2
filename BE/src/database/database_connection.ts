import { Pool } from 'pg';

const pool = new Pool({
  user: 'manager',
  host: 'localhost',
  database: 'manager',
  password: 'manager',
  port: 5432
});

export default pool;
