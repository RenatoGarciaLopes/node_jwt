// src/Infrastructure/Persistence/Redis/RedisClient.js
const { createClient } = require('redis');
const config = require('src/Config');

const redisClient = createClient({
  url: config.redis.url, // ex: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isReady) {
    await redisClient.connect();
    console.log('Connected to Redis');
  }
}

module.exports = { redisClient, connectRedis };
