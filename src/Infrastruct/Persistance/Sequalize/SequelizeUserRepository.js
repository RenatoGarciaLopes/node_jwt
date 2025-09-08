'use strict';

const bcrypt = require('bcryptjs');
const UserModel = require('src/Infrastruct/Persistance/Sequalize/Models/UserModel');

class SequelizeUserRepository {
  async save(userEntity) {
    const raw = typeof userEntity.toObject === 'function' ? userEntity.toObject() : userEntity;

    const payload = {
      id: raw.id || userEntity.id,
      name: raw.name || (userEntity.name && userEntity.name.value),
      email: raw.email || (userEntity.email && userEntity.email.value),
      password: raw.password || (userEntity.password && userEntity.password.hashedPassword),
    };

    await UserModel.upsert(payload);
    return this._toDomainLike(payload);
  }

  async findById(id) {
    const record = await UserModel.findByPk(id);
    if (!record) return null;
    return this._toDomainLike(record.get({ plain: true }));
  }

  async findByEmail(email) {
    const record = await UserModel.findOne({ where: { email } });
    if (!record) return null;
    return this._toDomainLike(record.get({ plain: true }));
  }

  _toDomainLike(record) {
    return {
      id: record.id,
      name: { value: record.name },
      email: { value: record.email },
      comparePassword: async (plainPassword) => bcrypt.compare(plainPassword, record.password),
    };
  }
}

module.exports = SequelizeUserRepository;


