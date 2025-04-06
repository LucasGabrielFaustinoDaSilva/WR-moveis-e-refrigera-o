const mongoose = require('mongoose');

const contatoSchema = new mongoose.Schema({
  nome: String,
  email: String,
  mensagem: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Contato', contatoSchema);
