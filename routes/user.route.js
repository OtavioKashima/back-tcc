import express from 'express';
import userController from '../controllers/user.controller.js';
import login from '../middleware/user.middleware.js';

const router = express.Router();

router.delete('/:id', userController.deleteUser);

router.post('/register', userController.registerUser);

router.put('/', login.required, userController.updateUser)

router.post('/login', userController.loginUser);

export default router;