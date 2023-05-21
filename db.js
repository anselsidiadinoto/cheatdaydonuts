const Pool = require('pg').Pool;
require('dotenv').config({ path: __dirname + '/.env' });

const pool = new Pool({
  connectionObject: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  ssl: process.env.DATABASE_URL ? true : false,
});

// const conString = process.env.CONNECTION_STRING;

// const pool = new Pool(conString);

module.exports = pool;
