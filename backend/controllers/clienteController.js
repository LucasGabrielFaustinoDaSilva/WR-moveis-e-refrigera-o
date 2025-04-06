const Cliente = require('../models/Cliente');

// Obter todos os clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Criar um novo cliente
exports.createCliente = async (req, res) => {
  const cliente = new Cliente({
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    endereco: req.body.endereco
  });

  try {
    const novoCliente = await cliente.save();
    res.status(201).json(novoCliente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
