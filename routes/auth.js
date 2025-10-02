// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { validarCPF, onlyDigits } = require('../utils/cpf');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
const jwtSecret = process.env.JWT_SECRET || 'troque_isto';
const jwtExpire = process.env.JWT_EXPIRES_IN || '1d';

// REGISTER
router.post(
  '/register',
  [
    body('nome').trim().notEmpty().withMessage('Nome obrigatório'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('cpf').custom(value => {
      if (!validarCPF(value)) throw new Error('CPF inválido');
      return true;
    }),
    body('senha').isLength({ min: 6 }).withMessage('Senha com mínimo 6 caracteres')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nome, email, cpf, senha } = req.body;
    const cpfOnly = onlyDigits(cpf);

    try {
      const conn = await pool.getConnection();
      try {
        // checar se email ou cpf já existe
        const [exists] = await conn.query(
          'SELECT id FROM users WHERE email = ? OR cpf = ? LIMIT 1',
          [email, cpfOnly]
        );
        if (exists.length > 0) {
          return res.status(409).json({ message: 'Email ou CPF já cadastrado' });
        }

        const hashed = await bcrypt.hash(senha, saltRounds);

        const [result] = await conn.query(
          'INSERT INTO users (nome, email, cpf, senha_hash, created_at) VALUES (?, ?, ?, ?, NOW())',
          [nome, email, cpfOnly, hashed]
        );

        const userId = result.insertId;
        // opcional: criar token imediato
        const token = jwt.sign({ id: userId, email }, jwtSecret, { expiresIn: jwtExpire });

        return res.status(201).json({
          message: 'Usuário registrado com sucesso',
          user: { id: userId, nome, email, cpf: cpfOnly },
          token
        });
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
  }
);

// LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, senha } = req.body;

    try {
      const conn = await pool.getConnection();
      try {
        const [rows] = await conn.query('SELECT id, nome, email, cpf, senha_hash FROM users WHERE email = ? LIMIT 1', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });

        const user = rows[0];
        const match = await bcrypt.compare(senha, user.senha_hash);
        if (!match) return res.status(401).json({ message: 'Credenciais inválidas' });

        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: jwtExpire });

        return res.json({
          message: 'Autenticado com sucesso',
          user: { id: user.id, nome: user.nome, email: user.email, cpf: user.cpf },
          token
        });
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
  }
);

module.exports = router;
