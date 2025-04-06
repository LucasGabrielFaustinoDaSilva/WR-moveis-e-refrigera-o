const express = require('express');
const router = express.Router();
const { enviarMensagem } = require('../controllers/contatoController');

router.post('/', enviarMensagem);

module.exports = router;
