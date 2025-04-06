const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const contatoRoutes = require('./routes/contatoRoutes');
app.use('/api/contato', contatoRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado ao MongoDB');
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
})
.catch((err) => console.error('❌ Erro ao conectar no MongoDB:', err));
