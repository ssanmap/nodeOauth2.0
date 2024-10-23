const { Sequelize } = require('sequelize');

// Crear una instancia de Sequelize y conectarse a PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
