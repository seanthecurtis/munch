// Import dependencies
import { DataTypes, Model, Optional, Sequelize } from "sequelize"

// Define attributes of a user
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define input for creating/updating a user (optional attributes)
export interface UserInput extends Optional<UserAttributes, "id"> {}

// Define output for retrieving a user (all required attributes)
export interface UserOutput extends Required<UserAttributes> {}

// User model class extending Sequelize Model and implementing UserAttributes
class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public status!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Initialize the User model in Sequelize
  static initialize(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users", // Define the table name in the database
      timestamps: true, // Include timestamps (createdAt and updatedAt)
      sequelize, // Pass the Sequelize instance
      indexes: [
        {
          name: "u_users_email", // Define the name of the index
          unique: true, // Ensure uniqueness of emails
          fields: ["email"], // Specify the fields to index
        },
      ],
    })
  }

  /**
   * Finds all users excluding specified fields from display.
   *
   * @param {string[]} exclude - Fields to exclude from the retrieved user data.
   * @returns {Promise<User[]>} A promise that resolves to an array of User instances.
   */
  static findAllFiltered(exclude: string[]): Promise<User[]> {
    return User.findAll({
      attributes: { exclude }, // Exclude specified fields from the retrieved data
    })
  }

  /**
   * Finds a user by primary key (id) excluding specified fields from display.
   *
   * @param {string} id - The id of the user to find.
   * @param {string[]} exclude - Fields to exclude from the retrieved user data.
   * @returns {Promise<User | null>} A promise that resolves to a User instance or null if not found.
   */
  static findByPkFiltered(id: string, exclude: string[]): Promise<User | null> {
    return User.findByPk(id, {
      attributes: { exclude }, // Exclude specified fields from the retrieved data
    })
  }
}

/**
 * Initializes the User model in the provided Sequelize instance.
 *
 * @param {Sequelize} sequelize - The Sequelize instance to initialize the User model in.
 * @returns {typeof User} The initialized User model class.
 */
export function initUserModel(sequelize: Sequelize): typeof User {
  User.initialize(sequelize) // Initialize the User model
  return User // Return the User model class
}

export default User // Export the User model class by default
