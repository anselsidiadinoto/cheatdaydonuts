const Pool = require('pg').Pool;
require('dotenv').config({ path: __dirname + '/.env' });

const conString = process.env.DB_CONNECTION_STRING;

const pool = new Pool({
  connectionString: conString,
  ssl: true,
});

// const pool = new Pool({
//   connectionObject: {
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     ssl: true,
//   },
// });

// const conString = process.env.CONNECTION_STRING;

// const pool = new Pool(conString);

module.exports = pool;
