// const { Pool } = require("pg");
// require("dotenv").config(); // Load environment variables

// const pool = new Pool({
//   connectionString: process.env.REACT_APP_SUPABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // Use true in production with proper SSL setup
//   },
// });

// module.exports = pool;
const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "alofa",
    password: "12345678",
    port: 5432,
});

module.exports = pool;