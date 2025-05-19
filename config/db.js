// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Silence20',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'certificados',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
});

// Función para probar la conexión y verificar la tabla (solo en desarrollo)
async function testConnection() {
  try {
    const res = await pool.query('SELECT 1+1 AS result');
    console.log('Conexión a PostgreSQL exitosa:', res.rows[0].result === 2);

    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'residentes'
      )
    `);
    console.log('Tabla residentes existe:', tableCheck.rows[0].exists);
  } catch (err) {
    console.error('Error de conexión a PostgreSQL:', err.message || err);
  }
}

if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};