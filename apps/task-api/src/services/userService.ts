import { JWT } from "@fastify/jwt"
import User, { UserInput, UserOutput } from "../models/userModel"
import { randomBytes, pbkdf2Sync } from "crypto"

export class UserService {
  // /api/users/register
  // Create user
  async userRegister(userData: UserInput): Promise<UserOutput> {
    const salt = this.generateSalt()
    const passwordHash = this.hashPassword(userData.password, salt)
    const password = `${salt}:${passwordHash}`
    const user = await User.create({...userData, password})
    return user
  }

  // /api/users/login
  // Login user
  async userLogin(userData: UserInput, fastifyJWT: JWT) {
    const user = await User.findOne({ where: { email: userData.email } })
    if (!user){
      return {}
    }
    const isValid = await this.validatePassword(userData.password, user.password)
    if(!isValid){
      return {}
    }
    const token = fastifyJWT.sign({ id: user.id})
    return {token}
  }

  // /api/users/:id
  // Fetch user by id
  async userGetOneById(id: string){
    const user = await User.findByPkFiltered(id, ["password"])
    if(!user){
      return {}
    }
    return user
  }

  // GET /api/users
  async userList(){
    const users = await User.findAllFiltered(["password"])
    return users
  }

  // Helpers
  private hashPassword(password: string, salt: string): string {
    const iterations = 10000
    const keyLength = 64
    const digest = "sha512"
    return pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex")
  }

  private generateSalt(): string {
    return randomBytes(16).toString("hex")
  }

  public async validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    const [salt, hashedPassword] = storedPassword.split(":")
    const hash = this.hashPassword(inputPassword, salt)
    return hash === hashedPassword
  }
  
}

