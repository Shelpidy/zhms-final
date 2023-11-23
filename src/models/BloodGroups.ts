import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../database/connection";

interface BloodGroupAttributes {
  bloodGroupId: string;
  groupName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BloodGroupCreationAttributes
  extends Optional<
    BloodGroupAttributes,
    "bloodGroupId" | "createdAt" | "updatedAt"
  > {}

class BloodGroup extends Model {}

BloodGroup.init(
  {
    bloodGroupId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    groupName: {
      allowNull: false,
      type: DataTypes.STRING(10),
    },
    volume: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "BloodGroup",
    tableName: "BloodGroups",
    timestamps: false,
    underscored: false,
  },
);

export default BloodGroup;
