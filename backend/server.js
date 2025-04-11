const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/orcamentos', require('./routes/orcamentoRoutes'));
app.use('/api/contratos', require('./routes/contratoRoutes'));
app.use('/api/boletos', require('./routes/boletoRoutes'));
app.use('/api/estoque', require('./routes/estoqueRoutes'));
app.use('/api/logistica', require('./routes/logisticaRoutes'));
app.use('/api/caixa', require('./routes/caixaRoutes'));

// Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));