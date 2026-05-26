const express = require('express');
const router = express.Router();
const { crearProveedor, obtenerProveedores } = require('../controllers/proveedorController');

router.post('/', crearProveedor);
router.get('/', obtenerProveedores);

module.exports = router;