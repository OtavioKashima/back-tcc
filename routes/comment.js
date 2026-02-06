import express from 'express';
import commentController from '../controllers/comment.contoller.js';
import login from '../middleware/user.middleware.js';

const router = express.Router();

// ======== ROTAS DE COMENTÁRIOS ========

// Criar um novo comentário (requer autenticação)
router.post('/comentario/criar', login.required, commentController.createComment);

// Obter todos os comentários de uma postagem
router.get('/comentarios/post/:post_id', commentController.getCommentsByPost);

// Atualizar um comentário (requer autenticação)
router.put('/comentario/atualizar', login.required, commentController.updateComment);

// Deletar um comentário (requer autenticação)
router.delete('/comentario/:id', login.required, commentController.deleteComment);

export default router;