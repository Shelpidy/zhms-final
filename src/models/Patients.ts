import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class Patient extends Model {
  public patientId!: string; // Change to string type
  public userId!: string; // Change to string type
  public diagnosis!: string;
  public bloodGroupId!: string; // Change to string type
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    patientId: {
      type: DataTypes.UUID, // Change to STRING type
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID, // Change to STRING type
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    diagnosis: {
      type: DataTypes.STRING(800),
    },
    bloodGroupId: {
      type: DataTypes.UUID, // Change to STRING type
      allowNull: false,
      references: {
        model: "BloodGroups",
        key: "bloodGroupId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    modelName: "Patient",
    tableName: "Patients",
    timestamps: true,
    underscored: false,
  },
);

export default Patient;
