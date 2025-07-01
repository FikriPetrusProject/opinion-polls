'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Option.belongsTo(models.Poll, { foreignKey: "Poll_Id" })
    }
  }
  Option.init({
    Poll_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Text cannot be empty" },
        notEmpty: { msg: "Text cannot be empty" }
      }
    }
  }, {
    sequelize,
    modelName: 'Option',
    timestamps: true
  });
  return Option;
};