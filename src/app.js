'use strict';

require('module-alias/register');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Middlewares e rotas
const errorHandler = require('src/Infrastruct/Express/middlewares/errorHandler');
const authRoutes = require('src/Infrastruct/Express/routes/auth.routes');

// Providers e Use Cases
const JWTProvider = require('src/Infrastruct/Providers/JWTProvider');
const RegisterUser = require('src/Application/UseCases/Auth/RegisterUser');
const LoginUser = require('src/Application/UseCases/Auth/LoginUser');

// Repositórios
const SequelizeUserRepository = require('src/Infrastruct/Persistance/Sequalize/SequelizeUserRepository');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Injeção de dependências
const userRepository = new SequelizeUserRepository();
const jwtProvider = new JWTProvider();

const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository, jwtProvider);

// Rotas
app.use('/auth', authRoutes(registerUserUseCase, loginUserUseCase));

// Swagger (carrega docs/swagger.yml se disponível)
try {
  const yaml = require('js-yaml');
  const swaggerPath = path.resolve(process.cwd(), 'docs', 'swagger.yml');
  if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
} catch (e) {
  console.error('Failed to load swagger.yml file:', e);
}

// Middleware de tratamento de erros (sempre por último)
app.use(errorHandler);

module.exports = app;



