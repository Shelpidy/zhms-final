"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BloodTransfusions", {
      transfusionId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      donorId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Donors",
          key: "donorId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      volume: {
        type: Sequelize.INTEGER,
      },
      recipientId: {
        type: Sequelize.UUID,
        references: {
          model: "requirers",
          key: "requirerId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      transfusionDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      bloodGroupId: {
        type: Sequelize.UUID,
        references: {
          model: "BloodGroups",
          key: "bloodGroupId",
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("BloodTransfusions");
  },
};
