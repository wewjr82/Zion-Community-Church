const { Pool } = require("pg");

// The secret connection string you copied earlier
const connectionString =
  "postgresql://postgres:lVZoeqajRrdjQVStWgmWhGadfcCenXpW@roundhouse.proxy.rlwy.net:37290/railway";

const pool = new Pool({
  connectionString,
});

module.exports = pool;
