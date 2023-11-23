"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Appointments", {
      appointmentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      appointmentStatus: {
        allowNull: false,
        type: Sequelize.ENUM("completed", "pending", "cancel"),
      },
      doctorId: {
        type: Sequelize.UUID,
        references: {
          model: "Doctors",
          key: "doctorId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reason: {
        type: Sequelize.STRING(800),
      },
      note: {
        type: Sequelize.STRING(8000),
      },
      patientId: {
        type: Sequelize.UUID,
        references: {
          model: "Patients",
          key: "patientId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      appointmentDate: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Appointments");
  },
};
