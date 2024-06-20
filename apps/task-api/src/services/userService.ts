// Import dependencies
import { JWT } from "@fastify/jwt"
import { randomBytes, pbkdf2Sync } from "crypto"

// Import custom
import User, { UserInput, UserOutput } from "../models/userModel"

/**
 * Service class for handling user-related operations.
 */
export class UserService {
  /**
   * Registers a new user.
   * @param {UserInput} userData - User data including email, password, and optional status.
   * @returns {Promise<UserOutput>} Created user object.
   */
  async userRegister(userData: UserInput): Promise<UserOutput> {
    const salt = this.generateSalt()
    const passwordHash = this.hashPassword(userData.password, salt)
    const password = `${salt}:${passwordHash}`

    const user = await User.create({ ...userData, password })
    return user
  }

  /**
   * Authenticates and logs in a user.
   * @param {UserInput} userData - User credentials including email and password.
   * @param {JWT} fastifyJWT - Fastify JWT instance for token signing.
   * @returns {Promise<{ token: string }>} Object containing the JWT token upon successful login.
   */
  async userLogin(userData: UserInput, fastifyJWT: JWT): Promise<{ token: string }> {
    const user = await User.findOne({ where: { email: userData.email } })
    if (!user){
      throw new Error("User not found")
    }

    const isValid = await this.validatePassword(userData.password, user.password)
    if (!isValid){
      throw new Error("User not found")
    }

    const token = fastifyJWT.sign({ id: user.id })
    return { token }
  }

  /**
   * Retrieves a user by their ID.
   * @param {string} id - User ID to fetch.
   * @returns {Promise<UserOutput>} User object excluding sensitive information.
   */
  async userGetOneById(id: string): Promise<UserOutput> {
    const user = await User.findByPkFiltered(id, ["password"])
    if (!user){
      throw new Error("User not found")
    }
    return user
  }

  /**
   * Retrieves a list of users.
   * @returns {Promise<UserOutput[]>} Array of user objects excluding sensitive information.
   */
  async userList(): Promise<UserOutput[]> {
    const users = await User.findAllFiltered(["password"])
    return users
  }

  // Helpers

  /**
   * Hashes the password using PBKDF2 with sha512 digest.
   * @param {string} password - Password to hash.
   * @param {string} salt - Salt used for hashing.
   * @returns {string} Hashed password.
   */
  private hashPassword(password: string, salt: string): string {
    const iterations = 10000
    const keyLength = 64
    const digest = "sha512"
    return pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex")
  }

  /**
   * Generates a random salt.
   * @returns {string} Randomly generated salt.
   */
  private generateSalt(): string {
    return randomBytes(16).toString("hex")
  }

  /**
   * Validates the input password against the stored hashed password.
   * @param {string} inputPassword - Password input by the user.
   * @param {string} storedPassword - Hashed password stored in the database.
   * @returns {Promise<boolean>} Boolean indicating whether the password is valid.
   */
  public async validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    const [salt, hashedPassword] = storedPassword.split(":")
    const hash = this.hashPassword(inputPassword, salt)
    return hash === hashedPassword
  }
}
