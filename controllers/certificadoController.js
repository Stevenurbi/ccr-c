const { pool, sql } = require('../config/db');
const { generatePDF } = require('../utils/pdfGenerator');

const createCertificado = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            apartment,
            moveInDate,
            documentType,
            documentNumber,
            purpose
        } = req.body;

        const request = pool.request();
        const result = await request
            .input('nombre', sql.NVarChar, firstName)
            .input('apellido', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .input('telefono', sql.NVarChar, phone)
            .input('apartamento', sql.NVarChar, apartment)
            .input('fecha_ingreso', sql.Date, moveInDate)
            .input('tipo_documento', sql.NVarChar, documentType)
            .input('numero_documento', sql.NVarChar, documentNumber)
            .input('proposito', sql.NVarChar, purpose)
            .input('fecha_solicitud', sql.DateTime, new Date())
            .query(`
                INSERT INTO Certificados (
                    nombre, apellido, email, telefono, apartamento,
                    fecha_ingreso, tipo_documento, numero_documento,
                    proposito, fecha_solicitud, estado
                )
                VALUES (
                    @nombre, @apellido, @email, @telefono, @apartamento,
                    @fecha_ingreso, @tipo_documento, @numero_documento,
                    @proposito, @fecha_solicitud, 'pendiente'
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        const certificadoId = result.recordset[0].id;
        res.status(201).json({ id: certificadoId });
    } catch (error) {
        console.error('Error al crear certificado:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

const getCertificado = async (req, res) => {
    try {
        const { id } = req.params;
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Certificados WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Certificado no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener certificado:', error);
        res.status(500).json({ message: 'Error al obtener el certificado' });
    }
};

module.exports = {
    createCertificado,
    getCertificado
};