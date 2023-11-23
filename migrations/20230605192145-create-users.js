"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      middleName: {
        type: Sequelize.STRING(50),
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      profileImage: {
        type: Sequelize.STRING(8000),
      },
      contactNumber: {
        allowNull: false,
        type: Sequelize.STRING(15),
      },
      gender: {
        allowNull: false,
        type: Sequelize.ENUM("male", "female", "other"),
        defaultValue: "other",
      },
      dateOfBirth: {
        type: Sequelize.DATE,
      },
      address: {
        type: Sequelize.STRING(100),
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50),
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM("patient", "doctor", "admin", "user"),
        defaultValue: "user",
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
