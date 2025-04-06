const Contato = require('../models/Contato');

exports.enviarMensagem = async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;
    const novoContato = new Contato({ nome, email, mensagem });
    await novoContato.save();
    res.status(201).json({ mensagem: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao enviar mensagem.' });
  }
};
