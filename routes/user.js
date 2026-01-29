const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const login = require('../middleware/user.middleware');

router.delete('/:id', userController.deleteUser);

router.post('/cadastrar', userController.registerUser);

router.put('/', login.required, userController.updateUser)

router.post('/login', userController.loginUser);
module.exports = router;