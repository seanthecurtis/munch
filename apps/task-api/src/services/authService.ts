import { UserModel } from "../models/user"
import { User } from "../types/default"
import crypto from "crypto"
import { promisify } from "util"
const scrypt = promisify(crypto.scrypt)

// Class to manage all auth related database interaction
export class AuthService {
  private saltLength = 16
  private keyLength = 64
  // Insert a new user
  // Unique key set on email - registration fails on duplicate email rejection
  registerService = async (userData: User): Promise<User | null> => {
    try {
      const password = await this.hashPassword(userData.password as string)
      userData.password = password
      return await UserModel.create(userData as UserModel)
    } catch (err) {
      return null
    }
  }
  
  // Fetch a user and verify password
  loginService = async (userData: User): Promise<User | null> => {
    const { email, password } = userData
    try{
      const user = await UserModel.findOne({ where: { email } })
      if (!user) {
        return null
      }
      // Validate password against hash
      const passwordValid = await this.verifyPassword(password as string, user.password as string)
      if(!passwordValid) return null
      return user
    }catch(err){
      return null
    }
  }

  // Method to one-way hash user passwords
  private async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(this.saltLength).toString("hex")
    const encoded = (await scrypt(password, salt, this.keyLength)) as Buffer
    return `${salt}:${encoded.toString("hex")}`
  }

  // Method to validate password against hash
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(":")
    const decoded = (await scrypt(password, salt, this.keyLength)) as Buffer
    return key === decoded.toString("hex")
  }
}
