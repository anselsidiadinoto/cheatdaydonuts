const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cheatday_donuts',
  password: 'password',
  port: 5432,
});

module.exports = pool;
