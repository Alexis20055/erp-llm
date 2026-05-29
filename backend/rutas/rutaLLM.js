const express = require('express');
const router = express.Router();
const { chat, obtenerLogs } = require('../controllers/llmController');

router.post('/chat', chat);
router.get('/logs', obtenerLogs);

module.exports = router;
