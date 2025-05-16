const sql = require('mssql');

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'CarreraCapital',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(config);

module.exports = { pool, sql };