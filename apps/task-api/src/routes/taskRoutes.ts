/**
 * Import dependencies
 */
import { FastifyInstance } from "fastify"

/**
 * Import custom controllers and schemas
 */
import { taskCreateHandler, taskUpdateHandler } from "../controllers/taskController"
import { taskCreateSchema, taskUpdateSchema } from "../schemas/schemas"

/**
 * Registers task-related routes on the provided Fastify server instance.
 *
 * @param {FastifyInstance} server - The Fastify server instance to register routes on.
 */
async function taskRoutes(server: FastifyInstance) {
  /**
   * POST /api/tasks/
   * Endpoint to create a new task.
   *
   * Request body should conform to taskCreateSchema.
   */
  server.post(
    "/",
    {
      preHandler: [server.authenticate],  // Middleware for authentication
      schema: taskCreateSchema  // Validation schema for request body
    },
    taskCreateHandler  // Controller function handling the request
  )

  /**
   * PUT /api/tasks/
   * Endpoint to update an existing task.
   *
   * Request body should conform to taskUpdateSchema.
   */
  server.put(
    "/",
    {
      preHandler: [server.authenticate],  // Middleware for authentication
      schema: taskUpdateSchema  // Validation schema for request body
    },
    taskUpdateHandler  // Controller function handling the request
  )
}

export default taskRoutes
