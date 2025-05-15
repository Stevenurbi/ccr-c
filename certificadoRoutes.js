const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoController');

router.post('/', certificadoController.createCertificado);
router.get('/:id', certificadoController.getCertificado);

module.exports = router;