'use strict';
const {
  Model
} = require('sequelize');
const { hashPwd } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Poll, { foreignKey: "User_Id" }),
        User.hasMany(models.Vote, { foreignKey: "User_Id" })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: { msg: "Email has been taken" },
      allowNull: false,
      validate: {
        notNull: { msg: "Email cannot be empty" },
        notEmpty: { msg: "Email cannot be empty" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password cannot be empty" },
        notEmpty: { msg: "Password cannot be empty" }
      }

    },
    provider: DataTypes.STRING,
    google_id: DataTypes.STRING,
    avatar_url: DataTypes.TEXT,
    role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    hooks: {
      beforeCreate(user, options) {
        user.password = hashPwd(user.password)
      }
    }
  });
  return User;
};