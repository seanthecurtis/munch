// Import dependencies
import { DataTypes, Model, Optional, Sequelize } from "sequelize"

// Import custom model
import User from "./userModel"

// Define attributes of a task
interface TaskAttributes {
  id: number;
  userId: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define input for creating/updating a task (optional attributes)
export interface TaskInput extends Optional<TaskAttributes, "id"> {}

// Define output for retrieving a task (all required attributes)
export interface TaskOutput extends Required<TaskAttributes> {}

// Task model class extending Sequelize Model and implementing TaskAttributes
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

  // Define association with User model
  static associate(models: { User: typeof User }) {
    Task.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    })
  }

  // Initialize the Task model in Sequelize
  static initialize(sequelize: Sequelize) {
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
          model: "users", // Referencing the users table
          key: "id", // Referencing the id column in the users table
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "tasks", // Define the table name in the database
      timestamps: true, // Include timestamps (createdAt and updatedAt)
      sequelize, // Pass the Sequelize instance
    })
  }
}

/**
 * Initializes the Task model in the provided Sequelize instance.
 *
 * @param {Sequelize} sequelize - The Sequelize instance to initialize the Task model in.
 * @returns {typeof Task} The initialized Task model class.
 */
export function initTaskModel(sequelize: Sequelize): typeof Task {
  Task.initialize(sequelize) // Initialize the Task model
  return Task // Return the Task model class
}

export default Task // Export the Task model class by default
