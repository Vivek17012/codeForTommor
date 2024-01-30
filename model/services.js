const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Normal', 'VIP'),
      allowNull: false,
    },
  });
module.exports=Service