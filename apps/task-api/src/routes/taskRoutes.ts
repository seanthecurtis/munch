import { FastifyInstance } from "fastify"
import { taskCreateHandler, taskUpdateHandler } from "../controllers/taskController"
import { $ref } from "../schemas/schemas"

async function taskRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("taskCreateSchema")
      }
    }, 
    taskCreateHandler
  )
  server.put(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("taskUpdateSchema")
      }
    }, 
    taskUpdateHandler
  )
}

export default taskRoutes