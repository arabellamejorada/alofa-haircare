const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

const pool = new Pool({
  connectionString: process.env.REACT_APP_SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Use true in production with proper SSL setup
  },
});

module.exports = pool;
