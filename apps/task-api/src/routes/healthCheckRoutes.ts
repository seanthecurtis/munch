import { FastifyInstance } from "fastify"
import { healthCheckHandler } from "../controllers/healthCheckController"

async function healthcheckRoutes(server: FastifyInstance) {
  server.get("/", healthCheckHandler)
}

export default healthcheckRoutes