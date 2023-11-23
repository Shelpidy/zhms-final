import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class Requirer extends Model {
  public requirerId!: string;
  public userId!: string;
  public bloodGroupId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Requirer.init(
  {
    requirerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    modelName: "Requirer",
    tableName: "Requirers",
    timestamps: true,
    underscored: false,
  },
);

export default Requirer;
