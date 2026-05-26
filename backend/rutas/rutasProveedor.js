const express = require('express');
const router = express.Router();
const { crearProveedor, obtenerProveedores, obtenerProveedorPorId, actualizarProveedor, eliminarProveedor } = require('../controllers/proveedorController');

router.post('/', crearProveedor);
router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedorPorId);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

module.exports = router;
