const Pool = require("pg").Pool;

const pool = new Pool({
  user: 'manager',
  host: 'localhost',
  database: 'manager',
  password: 'manager',
  port: 5432,
});

module.exports = {
  pool
}