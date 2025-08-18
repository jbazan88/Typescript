import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import RoleModel from './roleModel';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public image?: string;
  public token?: string;
  public locked!: boolean;
  public validated!: boolean;
  public rolId!: number;
  public role!: RoleModel;
  
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    locked: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    validated: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rolId: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, 
    modelName: 'User',
    tableName: 'users',
    paranoid: true, 
    timestamps: true,
  }
);

User.belongsTo(RoleModel, {
  foreignKey: 'rolId',
  targetKey: 'id',
  as: 'role',
});

export default User;