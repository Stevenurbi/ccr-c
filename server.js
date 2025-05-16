require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { pool, sql } = require('./config/db');
const { generatePDF } = require('./utils/pdfGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/certificados', require('./routes/certificadoRoutes'));

// Ruta para descargar el certificado
app.get('/api/certificados/download/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Certificados WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Certificado no encontrado' });
        }

        const certificado = result.recordset[0];
        const pdfBuffer = await generatePDF(certificado);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificado-${certificado.id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar el certificado' });
    }
});

// Iniciar servidor
app.listen(PORT, async () => {
    try {
        await pool.connect();
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log('Conexión a SQL Server establecida');
    } catch (err) {
        console.error('Error al conectar con SQL Server:', err);
    }
});