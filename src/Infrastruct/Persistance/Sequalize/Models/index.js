'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Resolve o caminho para config/config.json na raiz do projeto
const configPath = path.resolve(__dirname, '../../../../..', 'config', 'config.json');
const config = require(configPath)[env];

const db = {};

let sequelize;
if (config && config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else if (config && config.url) {
	sequelize = new Sequelize(config.url, { dialect: config.dialect, logging: false });
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file.indexOf('.test.js') === -1
		);
	})
	.forEach((file) => {
		const requiredModule = require(path.join(__dirname, file));

		// Suporta dois formatos:
		// 1) module.exports = (sequelize, DataTypes) => Model
		// 2) module.exports = Model (já definido)
		const model = typeof requiredModule === 'function'
			? requiredModule(sequelize, Sequelize.DataTypes)
			: requiredModule;

		if (model && model.name) {
			db[model.name] = model;
		}
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.Sequelize = Sequelize;

module.exports = db;

