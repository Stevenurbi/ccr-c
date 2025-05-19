// residentesDAO.js
const db = require('./db'); // NO crear un nuevo Pool aquí

const residentesDAO = {
  // Insertar nuevo residente
  insertarResidente: async (nombre, rut, departamento, fechaIngreso) => {
    if (!nombre || !rut || !departamento || !fechaIngreso) {
      throw new Error('Todos los campos son obligatorios para insertar un residente.');
    }
    try {
      const result = await db.query(
        'INSERT INTO residentes (nombre, rut, departamento, fecha_ingreso) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, rut, departamento, fechaIngreso]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error al insertar residente:', err.detail || err.message || err);
      throw err;
    }
  },

  // Obtener todos los residentes
  obtenerResidentes: async () => {
    try {
      const result = await db.query('SELECT * FROM residentes ORDER BY id');
      return result.rows;
    } catch (err) {
      console.error('Error al obtener residentes:', err.detail || err.message || err);
      throw err;
    }
  },

  // Buscar residente por RUT
  buscarPorRut: async (rut) => {
    if (!rut) {
      throw new Error('El RUT es obligatorio para buscar un residente.');
    }
    try {
      const result = await db.query('SELECT * FROM residentes WHERE rut = $1', [rut]);
      return result.rows[0];
    } catch (err) {
      console.error('Error al buscar residente:', err.detail || err.message || err);
      throw err;
    }
  }
};

module.exports = residentesDAO;