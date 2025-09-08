'use strict';

const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('src/Config');
const RedisTokenBlackListRepository = require('src/Infrastruct/Persistance/Redis/RedisTokenBlackListRepository');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const blacklistRepo = new RedisTokenBlackListRepository();
    const isBlacklisted = await blacklistRepo.exists(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } catch (e) {
    return res.status(500).json({ message: 'Auth error', detail: e.message });
  }
};

module.exports = authenticateToken;



