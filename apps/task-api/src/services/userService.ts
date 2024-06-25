import { UserModel } from "../models/user"
import { User, UserQueryParams } from "../types/default"

// Class to manage all user related database interaction
export class UserService {
  // Fetch a user by id
  userGetOneByID = async (id: string): Promise<User | null> => {
    try {
      const user = await UserModel.findOne({where: {id}, attributes: ["id"]})
      if(!user) return null
      return user.toJSON() || null
    } catch (err) {
      return null
    }
  }
  // Fetch a list of all users
  // Enhancement: add pagination params and defaults
  userList = async (filters: UserQueryParams): Promise<User[] | null> => {
    try {
      // Remove undefined keys for querying
      const params: Partial<UserQueryParams> = {}
      Object.keys(filters).forEach((i) => {
        const key = i as keyof UserQueryParams
        if (filters[key] !== undefined) {
          params[key] = filters[key]
        }
      })
      const where = params
      const users = await UserModel.findAll({where, attributes: ["id", "email", "createdAt"]})
      const output = users.map(o => o.toJSON())
      return output
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
