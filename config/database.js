const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydb', 'root', 'Vivek123#', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;