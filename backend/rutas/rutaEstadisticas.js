const express = require('express');
const router = express.Router();
const { stockBajo, valorInventario, desechosPorMes } = require('../controllers/estadisticasController');

router.get('/stock-bajo', stockBajo);
router.get('/valor-inventario', valorInventario);
router.get('/desechos-por-mes', desechosPorMes);

module.exports = router;
