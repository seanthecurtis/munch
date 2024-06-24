import { UserModel } from "../models/user"
import { User } from "../types/default"

export class AuthService {
  registerService = async (userData: User): Promise<User | null> => {
    try {
      return await UserModel.create(userData as UserModel)
    } catch (err) {
      return null
    }
  }
  
  loginService = async (userData: User): Promise<User | null> => {
    const { email, password } = userData
    try{
      const user = await UserModel.findOne({ where: { email } })
      if (!user || user.password !== password) {
        return null
      }
      return user
    }catch(err){
      return null
    }
  }
}
