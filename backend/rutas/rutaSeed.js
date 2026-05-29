const express = require('express');
const router = express.Router();
const { poblar } = require('../controllers/seedController');

router.post('/', poblar);

module.exports = router;
