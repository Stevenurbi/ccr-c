const express = require('express');
const router = express.Router();
const certificadoController = require('./controllers/certificadoController');

// Crear un nuevo certificado
router.post('/', certificadoController.crearCertificado);

// Descargar el certificado en PDF por ID (debe ir antes de /:id)
router.get('/download/:id', certificadoController.downloadCertificado);

// Obtener un certificado por ID
router.get('/:id', certificadoController.obtenerCertificado);

module.exports = router;