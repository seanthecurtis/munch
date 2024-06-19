import User, { UserInput, UserOutput } from "../models/userModel"

export class UserRegisterService {
  async userRegister(userData: UserInput): Promise<UserOutput> {
    const user = await User.create(userData)
    return user
  }
}