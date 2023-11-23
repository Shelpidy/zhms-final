import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class Doctor extends Model {
  public doctorId!: string;
  public specializationId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Doctor.init(
  {
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    specializationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Specializations",
        key: "specializationId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Doctor",
    tableName: "Doctors",
    timestamps: true,
    underscored: false,
  },
);

export default Doctor;
