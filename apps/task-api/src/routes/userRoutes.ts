/**
 * Import dependencies
 */
import { FastifyInstance } from "fastify"

/**
 * Import custom controllers and schemas
 */
import { userGetOneHandler, userListHandler, userLoginHandler, userRegisterHandler } from "../controllers/userController"
import { userLoginSchema, userRegisterSchema } from "../schemas/schemas"

/**
 * Registers user-related routes on the provided Fastify server instance.
 *
 * @param {FastifyInstance} server - The Fastify server instance to register routes on.
 */
async function userRoutes(server: FastifyInstance) {
  /**
   * POST /api/users/register
   * Endpoint to register a new user.
   *
   * Request body should conform to userRegisterSchema.
   */
  server.post(
    "/register",
    {
      schema: userRegisterSchema  // Validation schema for request body
    },
    userRegisterHandler  // Controller function handling the request
  )

  /**
   * POST /api/users/login
   * Endpoint to login an existing user.
   *
   * Request body should conform to userLoginSchema.
   */
  server.post(
    "/login",
    {
      schema: userLoginSchema  // Validation schema for request body
    },
    userLoginHandler  // Controller function handling the request
  )

  /**
   * GET /api/users/:id
   * Endpoint to fetch a user by ID.
   *
   * Requires authentication using server.authenticate middleware.
   */
  server.get(
    "/:id",
    {
      preHandler: [server.authenticate]  // Middleware for authentication
    },
    userGetOneHandler  // Controller function handling the request
  )

  /**
   * GET /api/users
   * Endpoint to fetch all users.
   *
   * Requires authentication using server.authenticate middleware.
   */
  server.get(
    "/",
    {
      preHandler: [server.authenticate]  // Middleware for authentication
    },
    userListHandler  // Controller function handling the request
  )
}

export default userRoutes
