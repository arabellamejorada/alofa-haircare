const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "alofa",
    password: "12345678",
    port: 5432,
});

module.exports = pool;