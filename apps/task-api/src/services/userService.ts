import { UserModel } from "../models/user"
import { User, UserFilters } from "../types/default"

export class UserService {
  userGetOneByID = async (id: string): Promise<User | null> => {
    try {
      return await UserModel.findOne({where: {id}, attributes: ["id"]})
    } catch (err) {
      return null
    }
  }
  userList = async (filters: UserFilters): Promise<User[] | null> => {
    try {
      const where = filters
      return await UserModel.findAll({where, attributes: ["id", "email", "createdAt"]})
    } catch (err) {
      return null
    }
  }
}
