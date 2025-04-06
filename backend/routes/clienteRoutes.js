const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Criar cliente
router.post('/', async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Listar clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
