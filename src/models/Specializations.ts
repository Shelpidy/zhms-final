import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../database/connection";

interface SpecializationAttributes {
  specializationId: string;
  specializationName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SpecializationCreationAttributes
  extends Optional<
    SpecializationAttributes,
    "specializationId" | "createdAt" | "updatedAt"
  > {}

class Specialization
  extends Model<SpecializationAttributes, SpecializationCreationAttributes>
  implements SpecializationAttributes
{
  public specializationId!: string;
  public specializationName!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Specialization.init(
  {
    specializationId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    specializationName: {
      allowNull: false,
      type: DataTypes.STRING(50),
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
    modelName: "Specialization",
    tableName: "Specializations",
    timestamps: false,
    underscored: false,
  },
);

export default Specialization;
