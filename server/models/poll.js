'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Poll.belongsTo(models.User, { foreignKey: "User_Id" })
    }
  }
  Poll.init({
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Question cannot be empty" },
        notNull: { msg: "Question cannot be empty" }
      }
    },
    User_Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Poll',
    timestamps: true
  });
  return Poll;
};