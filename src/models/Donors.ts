import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class Donor extends Model {}

Donor.init(
  {
    donorId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(50),
    },
    profileImage: {
      type: DataTypes.STRING(8000),
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
    },
    bloodGroupId: {
      type: DataTypes.UUID,
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
    modelName: "Donor",
    tableName: "Donors",
    timestamps: true,
    underscored: false,
  },
);

export default Donor;
