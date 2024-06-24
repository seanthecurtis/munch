import { UserModel } from "../models/user"
import { User, UserQueryParams } from "../types/default"

// Class to manage all user related database interaction
export class UserService {
  // Fetch a user by id
  userGetOneByID = async (id: string): Promise<User | null> => {
    try {
      return await UserModel.findOne({where: {id}, attributes: ["id"]})
    } catch (err) {
      return null
    }
  }
  // Fetch a list of all users
  // Enhancement: add pagination params and defaults
  userList = async (filters: UserQueryParams): Promise<User[] | null> => {
    try {
      const where = filters
      return await UserModel.findAll({where, attributes: ["id", "email", "createdAt"]})
    } catch (err) {
      return null
    }
  }
}
