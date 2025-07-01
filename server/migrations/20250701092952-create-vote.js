'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      User_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      Poll_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Polls",
          key: "id"
        }
      },
      Option_Id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Options",
          key: "id"
        }
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

    await queryInterface.addConstraint("votes", {
      fields: ["user_id", "poll_id"],
      type: "unique",
      name: "unique_vote_per_user_per_poll",
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Votes');
  }
};