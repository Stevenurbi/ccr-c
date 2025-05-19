const db = require('../config/db');
const { generatePDF } = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');

// Crear un nuevo certificado
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

        const result = await db.query(
            `INSERT INTO certificados (
                nombre, apellido, email, telefono, apartamento,
                fecha_ingreso, tipo_documento, numero_documento,
                proposito, fecha_solicitud, estado
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8,
                $9, $10, $11
            ) RETURNING *`,
            [
                firstName,
                lastName,
                email,
                phone,
                apartment,
                moveInDate,
                documentType,
                documentNumber,
                purpose,
                new Date(),
                'pendiente'
            ]
        );

        const certificado = result.rows[0];

        // Generar y guardar el PDF automáticamente
        const pdfBuffer = await generatePDF(certificado);
        const pdfDir = path.join(__dirname, '../certificados_pdf');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }
        const pdfPath = path.join(pdfDir, `certificado-${certificado.id}.pdf`);
        fs.writeFileSync(pdfPath, pdfBuffer);

        res.status(201).json({ id: certificado.id, message: 'Certificado creado y PDF guardado.' });
    } catch (error) {
        console.error('Error al crear certificado:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

// Obtener un certificado por ID
const getCertificado = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM certificados WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Certificado no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener certificado:', error);
        res.status(500).json({ message: 'Error al obtener el certificado' });
    }
};

// Descargar el certificado en PDF por ID
const downloadCertificado = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM certificados WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Certificado no encontrado' });
        }

        const certificado = result.rows[0];
        const pdfBuffer = await generatePDF(certificado);

        // Crear la carpeta si no existe
        const pdfDir = path.join(__dirname, '../certificados_pdf');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }

        // Guardar el PDF en la carpeta certificados_pdf
        const pdfPath = path.join(pdfDir, `certificado-${id}.pdf`);
        fs.writeFileSync(pdfPath, pdfBuffer);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificado-${id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error al descargar certificado:', error);
        res.status(500).json({ message: 'Error al generar el PDF' });
    }
};

module.exports = {
  crearCertificado: createCertificado,
  obtenerCertificado: getCertificado,
  downloadCertificado
};