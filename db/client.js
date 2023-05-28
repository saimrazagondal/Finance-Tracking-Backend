// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.PG_DB_USER,
//   host: process.env.PG_DB_HOST,
//   database: process.env.PG_DB_DATABASE,
//   password: process.env.PG_DB_PASSWORD,
//   port: process.env.PG_DB_PORT,
// });

// module.exports = pool;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PG_DB_DATABASE,
  process.env.PG_DB_USER,
  process.env.PG_DB_PASSWORD,
  {
    host: process.env.PG_DB_HOST,
    dialect: 'postgres',
  }
);

module.exports = sequelize;
