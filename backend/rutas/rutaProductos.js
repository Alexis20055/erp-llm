const express = require('express');
const router = express.Router();
const { crearProducto, obtenerProductos } = require('../controllers/productoController');

router.post('/', crearProducto);
router.get('/', obtenerProductos);

module.exports = router;