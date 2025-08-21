const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "softjobs",
  password: process.env.PGPASSWORD || "1234",
  port: Number(process.env.PGPORT) || 5433,
  allowExitOnIdle: true,
});

module.exports = pool;
