"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Status", {
      statusId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      lastSeen: {
        type: Sequelize.DATE,
      },
      isOnline: {
        type: Sequelize.BOOLEAN,
      },
      activeRoomId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Rooms",
          key: "roomId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable("Status");
  },
};
