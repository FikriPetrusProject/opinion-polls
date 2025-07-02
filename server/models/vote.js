'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vote.belongsTo(models.User, { foreignKey: "User_Id" })
      Vote.belongsTo(models.Poll, { foreignKey: "Poll_Id" })
      Vote.belongsTo(models.Option, { foreignKey: "Option_Id" })
    }
  }
  Vote.init({
    User_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Poll_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Option_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Vote',
    timestamps: true
  });
  return Vote;
};