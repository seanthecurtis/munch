import { FastifyInstance } from "fastify"
import { userGetOneHandler, userListHandler, userLoginHandler, userRegisterHandler } from "../controllers/userController"
import { userLoginSchema, userRegisterSchema } from "../schemas/schemas"

/**
 * Registers user-related routes on the provided Fastify server instance.
 * @param server The Fastify server instance to register routes on.
 */
async function userRoutes(server: FastifyInstance) {
  // Route for user registration
  server.post(
    "/register",
    {
      schema: userRegisterSchema // Validate request payload against user registration schema
    },
    userRegisterHandler // Handler function for user registration
  )

  // Route for user login
  server.post(
    "/login",
    {
      schema: userLoginSchema // Validate request payload against user login schema
    },
    userLoginHandler // Handler function for user login
  )

  // Route to get a specific user by ID
  server.get(
    "/:id",
    {
      preHandler: [server.authenticate] // Ensure authentication before handling the request
    },
    userGetOneHandler // Handler function to get a specific user by ID
  )

  // Route to get the list of all users
  server.get(
    "/",
    {
      preHandler: [server.authenticate] // Ensure authentication before handling the request
    },
    userListHandler // Handler function to get the list of all users
  )
}

export default userRoutes
