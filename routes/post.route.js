import express from 'express';
import postController from '../controllers/post.controller.js';
import login from '../middleware/user.middleware.js';

const router = express.Router();

// ======== ROTAS DE POSTAGENS ========

// Criar uma nova postagem (requer autenticação)
router.post('/post/criar', login.required, postController.createPost);

// Obter todas as postagens
router.get('/posts', postController.getAllPosts);

// Obter uma postagem com seus comentários
router.get('/post/:post_id', postController.getPostWithComments);

// Atualizar uma postagem (requer autenticação)
router.put('/post/atualizar', login.required, postController.updatePost);

// Deletar uma postagem (requer autenticação)
router.delete('/post/:id', login.required, postController.deletePost);

export default router;