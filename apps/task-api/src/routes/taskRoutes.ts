import { FastifyInstance } from "fastify"
import { taskCreateHandler, taskUpdateHandler } from "../controllers/taskController"
import { taskCreateSchema, taskUpdateSchema } from "../schemas/schemas"

async function taskRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {preHandler: [server.authenticate], schema: taskCreateSchema}, 
    taskCreateHandler
  )
  server.put(
    "/",
    {preHandler: [server.authenticate], schema: taskUpdateSchema},
    taskUpdateHandler
  )
}

export default taskRoutes