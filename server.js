// server.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// importa rotas de autenticação
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// rota de teste
app.get('/', (req, res) => res.send('API de autenticação rodando'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server na porta ${port}`));
