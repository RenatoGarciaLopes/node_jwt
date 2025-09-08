'use strict';

require('module-alias/register');

const express = require('express');
const app = require('app') || express();
const sequelize = require('src/Infrastruct/Persistance/Sequalize/database');
const { connectRedis } = require('src/Infrastruct/Persistance/Redis/RedisClient');
const config = require('src/Config');

const PORT = config.server.port || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected and synchronized!');

    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access API at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();



