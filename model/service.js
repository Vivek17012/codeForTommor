//const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  Service.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      priceOptions: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: 'Service',
    }
  );
  return Service;
};
