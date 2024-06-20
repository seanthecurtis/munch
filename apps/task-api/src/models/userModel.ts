import { DataTypes, Model, Optional, Sequelize } from "sequelize"

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public status!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static initialize(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      tableName: "users",
      timestamps: true,
      sequelize,
      indexes: [
        {
          name: "u_users_email",
          unique: true,
          fields: ["email"],
        }
      ],
    })
  }

  // Custom findall method to remove fields from display
  static findAllFiltered(exclude: string[]) {
    return User.findAll({
      attributes: { exclude }
    })
  }
  static findByPkFiltered(id: string, exclude: string[]) {
    return User.findByPk(id,{
      attributes: { exclude }
    })
  }
}

export function initUserModel(sequelize: Sequelize) {
  User.initialize(sequelize)
  return User
}

export default User
