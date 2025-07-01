'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "local"
      },
      goodle_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      avatar_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "user",
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};