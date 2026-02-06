const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.contoller');
const login = require('../middleware/user.middleware');

// ======== ROTAS DE COMENTÁRIOS ========

// Criar um novo comentário (requer autenticação)
router.post('/comentario/criar', login.required, commentController.createComment);

// Obter todos os comentários de uma postagem
router.get('/comentarios/post/:post_id', commentController.getCommentsByPost);

// Atualizar um comentário (requer autenticação)
router.put('/comentario/atualizar', login.required, commentController.updateComment);

// Deletar um comentário (requer autenticação)
router.delete('/comentario/:id', login.required, commentController.deleteComment);

