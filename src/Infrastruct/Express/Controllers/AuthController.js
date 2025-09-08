'use strict';

const RegisterUserInput = require('src/Application/DTOs/RegisterUserInput');
const LoginUserInput = require('src/Application/DTOs/LoginUserInput');
const jwt = require('jsonwebtoken');
const RedisTokenBlackListRepository = require('src/Infrastruct/Persistance/Redis/RedisTokenBlackListRepository');

class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const input = new RegisterUserInput(name, email, password);
      const userOutput = await this.registerUserUseCase.execute(input);
      return res.status(201).json(userOutput);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const input = new LoginUserInput(email, password);
      const authOutput = await this.loginUserUseCase.execute(input);
      return res.status(200).json(authOutput);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.decode(token);
      const nowSec = Math.floor(Date.now() / 1000);
      const ttl = decoded && decoded.exp ? Math.max(decoded.exp - nowSec, 0) : 0;

      const blacklistRepo = new RedisTokenBlackListRepository();
      await blacklistRepo.add(token, ttl > 0 ? ttl : 60); // garante expiração mínima

      return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;



