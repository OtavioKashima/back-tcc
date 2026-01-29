const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const login = require('../middleware/usuarios.middleware');

router.delete('/:id', commentController.deletComment);

router.post('/cadastrar', commentController.createComment);

router.put('/', login.required, commentController.updateComment)
module.exports = router;