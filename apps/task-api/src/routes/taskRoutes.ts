import { FastifyInstance } from "fastify"
import { taskAssignHandler, taskCreateHandler, taskDeleteHandler, taskGetOneHandler, taskListHandler, taskUpdateHandler } from "../controllers/taskController"
import { taskAssignSchema, taskCreateSchema, taskUpdateSchema } from "../schemas/schemas"

/**
 * Registers routes related to task management.
 * @param server The Fastify server instance to register routes on.
 */
async function taskRoutes(server: FastifyInstance) {
  // Route for creating a new task
  server.post(
    "/",
    {
      preHandler: [server.authenticate], // Ensure authentication before handling the request
      schema: taskCreateSchema // Validate request payload against task creation schema
    },
    taskCreateHandler // Handler function for creating a new task
  )

  // Route to get a list of tasks for a user
  server.get(
    "/",
    {
      preHandler: [server.authenticate], // Ensure authentication before handling the request
    },
    taskListHandler // Handler function for retrieving a list of tasks
  )

  // Route to get a task
  server.get(
    "/:id",
    {
      preHandler: [server.authenticate], // Ensure authentication before handling the request
    },
    taskGetOneHandler // Handler function for retrieving task details
  )

  // Route for updating an existing task
  server.put(
    "/:id",
    {
      preHandler: [server.authenticate], // Ensure authentication before handling the request
      schema: taskUpdateSchema // Validate request payload against task update schema
    },
    taskUpdateHandler // Handler function for updating an existing task
  )

  // Route for updating an existing task
  server.delete(
    "/:id",
    {
      preHandler: [server.authenticate], // Ensure authentication before handling the request
    },
    taskDeleteHandler // Handler function for updating an existing task
  )

    // Route for assigning a task to another user
    server.put(
      "/assign/:id",
      {
        preHandler: [server.authenticate], // Ensure authentication before handling the request
        schema: taskAssignSchema           // Validate payload against user assign schema
      },
      taskAssignHandler // Handler function for updating an existing task
    )
}

export default taskRoutes
