import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class Appointment extends Model {
  public appointmentId!: number;
  public appointmentStatus!: "completed" | "pending" | "cancel";
  public doctorId!: string;
  public reason?: string;
  public note?: string;
  public patientId!: number;
  public appointmentDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    appointmentStatus: {
      type: DataTypes.ENUM("completed", "pending", "cancel"),
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUIDV4,
      references: {
        model: "Doctors",
        key: "doctorId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    reason: {
      type: DataTypes.STRING(800),
    },
    note: {
      type: DataTypes.STRING(8000),
    },
    patientId: {
      type: DataTypes.UUIDV4,
      references: {
        model: "Patients",
        key: "patientId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    appointmentDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "Appointments",
    timestamps: true,
    underscored: false,
  },
);

export default Appointment;
