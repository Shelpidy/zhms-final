import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class BloodTransfusion extends Model {}

BloodTransfusion.init(
  {
    transfusionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    donorId: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: "Donors",
        key: "donorId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    volume: {
      type: DataTypes.INTEGER,
    },
    recipientId: {
      type: DataTypes.UUID,
      references: {
        model: "Requirers",
        key: "requirerId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    transfusionDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
    modelName: "BloodTransfusion",
    tableName: "BloodTransfusions",
    timestamps: true,
    underscored: false,
  },
);

export default BloodTransfusion;
