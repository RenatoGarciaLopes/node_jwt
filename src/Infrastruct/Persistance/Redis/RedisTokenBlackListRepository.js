'use strict';

const ITokenBlacklistRepository = require('src/Domain/Repositories/ITokenBlackListRepository');
const { redisClient } = require('src/Infrastruct/Persistance/Redis/RedisClient');

class RedisTokenBlackListRepository extends ITokenBlacklistRepository {
  constructor(prefix = 'blacklist:token:') {
    super();
    this.prefix = prefix;
  }

  _key(token) {
    return `${this.prefix}${token}`;
  }

  async add(token, expiresInSeconds) {
    if (!token) throw new Error('Token is required');   

    const key = this._key(token);

    if (expiresInSeconds && Number.isFinite(Number(expiresInSeconds))) {
      await redisClient.setEx(key, Number(expiresInSeconds), '1');
    } else {
      await redisClient.set(key, 'revoked');
    }
  }

  async exists(token) {
    if (!token) return false;
    const key = this._key(token);
    const val = await redisClient.get(key);
    return val !== null;
  }
}

module.exports = RedisTokenBlackListRepository;


