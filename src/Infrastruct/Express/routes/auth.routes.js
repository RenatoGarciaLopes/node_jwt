'use strict';

const { Router } = require('express');
const AuthController = require('src/Infrastruct/Express/controllers/AuthController');
const validate = require('src/Infrastruct/Express/middlewares/validationMiddleware');
const { registerSchema, loginSchema } = require('src/Infrastruct/Express/validationSchemas/authSchemas');
const authenticateToken = require('src/Infrastruct/Express/middlewares/AuthMiddleware');

module.exports = (registerUserUseCase, loginUserUseCase) => {
  const router = Router();
  const authController = new AuthController(registerUserUseCase, loginUserUseCase);

  router.post('/register', validate(registerSchema), authController.register.bind(authController));
  router.post('/login', validate(loginSchema), authController.login.bind(authController));
  router.post('/logout', authenticateToken, authController.logout.bind(authController));
  router.post('/logout', authController.logout.bind(authController));
  return router;
};


