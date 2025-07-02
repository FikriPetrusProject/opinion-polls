'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Polls", "expiresAt", {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.addColumn("Polls", "isClosed", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Polls", "expiresAt");
    await queryInterface.removeColumn("Polls", "isClosed");
  }
};
