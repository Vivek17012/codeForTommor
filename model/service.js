const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Service extends Model {
  static associate(models) {
    Service.belongsTo(models.Category, { foreignKey: 'categoryId' });
  }
}

Service.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceOptions: {
      type: DataTypes.STRING,
      allowNull: true, // Adjust this based on your requirements
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'Service',
  }
);

module.exports = Service;

