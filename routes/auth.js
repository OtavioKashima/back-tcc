// auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Nosso pool de conexão

const router = express.Router();
const saltRounds = 10; // Custo do hash do bcrypt

// --- ROTA DE REGISTRO (POST /api/registrar) ---
router.post('/registrar', async (req, res) => {
  const { nome, cpf, email, senha, telefone } = req.body;

  // Validação básica
  if (!nome || !cpf || !email || !senha) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  try {
    // 1. Verificar se o email ou CPF já existem
    const [existing] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? OR cpf = ?',
      [email, cpf]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email ou CPF já cadastrado.' });
    }

    // 2. Criptografar a senha (Hashing)
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Inserir o novo usuário no banco
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, cpf, email, senha, telefone) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf, email, senhaHash, telefone]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.insertId });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// --- ROTA DE LOGIN (POST /api/login) ---
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    // 1. Buscar o usuário pelo email
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      // Mensagem genérica para segurança (não diz se foi o email ou a senha)
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const user = rows[0];

    // 2. Comparar a senha enviada com o hash salvo no banco
    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      // Senha incorreta
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // 3. Gerar o Token JWT
    const payload = {
      id: user.id,
      nome: user.nome,
      email: user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // Login bem-sucedido
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;