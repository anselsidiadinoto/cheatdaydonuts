const Pool = require('pg').Pool;
require('dotenv').config({ path: __dirname + '/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

// const conString = process.env.CONNECTION_STRING;

// const pool = new Pool(conString);

module.exports = pool;
