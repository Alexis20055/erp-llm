const express = require('express');
const router = express.Router();
const { registrarDesecho, obtenerDesechos, obtenerDesechoPorId, actualizarDesecho, eliminarDesecho, verificarCaducados } = require('../controllers/desechoController');

router.post('/verificar-caducados', verificarCaducados);
router.post('/', registrarDesecho);
router.get('/', obtenerDesechos);
router.get('/:id', obtenerDesechoPorId);
router.put('/:id', actualizarDesecho);
router.delete('/:id', eliminarDesecho);

module.exports = router;
