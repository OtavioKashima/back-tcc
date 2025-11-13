// index.js
require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importa o pool (apenas para garantir que ele inicie)
const authRoutes = require('./routes/auth'); // Nossas rotas de login/registro
const verificarToken = require('./middlewares/middleware'); // Nosso middleware de proteção

const app = express();
const port = process.env.PORT || 3000;

// Middlewares essenciais
app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Permite que o Express entenda JSON no corpo das requisições

// --- Rotas Públicas ---
// (Qualquer um pode acessar)
app.use('/api', authRoutes); // Usa as rotas de /api/registrar e /api/login

// --- Rotas Protegidas (Exemplo) ---
// (Somente usuários com token válido podem acessar)

// Exemplo: Criar uma nova postagem (usando o schema 'postagens')
// Note o 'verificarToken' antes da lógica da rota
app.post('/api/postagens', verificarToken, async (req, res) => {
  const { tipo_postagem, titulo, descricao, raca, genero, idade, foto } = req.body;
  
  // O 'req.user.id' foi adicionado pelo middleware 'verificarToken'
  const usuarios_id = req.user.id; 
  const data_criacao = new Date();

  try {
    const [result] = await pool.query(
      'INSERT INTO postagens (tipo_postagem, titulo, descricao, raca, genero, idade, foto, data_criacao, usuarios_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [tipo_postagem, titulo, descricao, raca, genero, idade, foto, data_criacao, usuarios_id]
    );
    
    res.status(201).json({ message: 'Postagem criada com sucesso!', postId: result.insertId });
  
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// Exemplo: Rota protegida para ver o perfil
app.get('/api/perfil', verificarToken, (req, res) => {
  // Graças ao middleware, req.user contém os dados do token (id, nome, email)
  res.status(200).json({
    message: 'Esta é uma rota protegida.',
    usuario: req.user 
  });
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});