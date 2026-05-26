const express = require('express');
const router = express.Router();
const { registrarDesecho, obtenerDesechos } = require('../controllers/desechoController');

router.post('/', registrarDesecho);
router.get('/', obtenerDesechos);

module.exports = router;