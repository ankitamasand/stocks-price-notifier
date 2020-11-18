const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database,
  ssl: config.ssl,
});

module.exports = pool;