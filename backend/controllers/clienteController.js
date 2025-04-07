const ClienteModel = require('../models/clienteModel');

exports.listar = async (req, res) => {
  try {
    const clientes = await ClienteModel.listarTodos();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoId = await ClienteModel.criar(req.body);
    res.status(201).json({ id: novoId });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    await ClienteModel.atualizar(req.params.id, req.body);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.excluir = async (req, res) => {
  try {
    await ClienteModel.excluir(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};