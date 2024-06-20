import { DataTypes, Model, Optional, Sequelize } from "sequelize"
import User from "./userModel"

interface TaskAttributes {
  id: number;
  userId: number,
  title: string,
  description: string,
  dueDate: string,
  priority: string,
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TaskInput extends Optional<TaskAttributes, "id"> {}
export interface TaskOutput extends Required<TaskAttributes> {}

class Task extends Model<TaskAttributes, TaskInput> implements TaskAttributes {
  public id!: number
  public userId!: number
  public title!: string
  public description!: string
  public dueDate!: string
  public priority!: string
  public status!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models: { User: typeof User }) {
    Task.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    })
  }
  static initialize(sequelize: Sequelize){
    Task.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "tasks",
      timestamps: true,
      sequelize,
      // specify index names - sequelize adds new indexes every time with sync
      // indexes: [
      //   {
      //     name: "u_users_email",
      //     unique: true,
      //     fields: ["email"],
      //   }
      // ],
    })
  }
}

export function initTaskModel(sequelize: Sequelize){
  Task.initialize(sequelize)
  return Task
}

export default Task