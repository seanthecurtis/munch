// Import dependencies
import { FastifyReply, FastifyRequest, GetParams } from "fastify"

// Import custom
import { UserService } from "../services/userService"
import { UserInput } from "../models/userModel"

/**
 * Controller function for user registration.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function userRegisterHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userService = new UserService()
    const { email, password, status } = request.body as UserInput

    const user = await userService.userRegister({ email, password, status })
    if (user) {
      return reply.status(201).send({ message: "Registration successful" })
    }
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to register user" })
  }
}

/**
 * Controller function to fetch list of users.
 *
 * @param {FastifyRequest} _: The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function userListHandler(_: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userService = new UserService()

    const users = await userService.userList()
    return reply.status(200).send({ users })
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to fetch user list" })
  }
}

/**
 * Controller function for user login.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function userLoginHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userService = new UserService()
    const { email, password } = request.body as UserInput

    const { token } = await userService.userLogin({ email, password }, request.jwt)
    if (token && token.length > 0) {
      // Add cookies
      reply.setCookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "strict", // CSRF protection
      })
      return reply.status(200).send({ message: "Login successful", token })
    }
    return reply.status(400).send({ message: "Failed to login user" })
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to login user" })
  }
}

/**
 * Controller function to fetch a user by ID.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function userGetOneHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userService = new UserService()
    const { id } = request.params as GetParams

    const user = await userService.userGetOneById(id)
    if (user) {
      return reply.status(200).send({ message: "User found", user })
    }
    return reply.status(404).send({ message: "User not found" })
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to fetch user" })
  }
}
