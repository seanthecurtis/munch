import { FastifyInstance } from "fastify"
import { healthCheckHandler } from "../controllers/healthCheckController"

/**
 * Registers healthcheck routes on the provided Fastify server instance.
 *
 * @param {FastifyInstance} server - The Fastify server instance to register routes on.
 */
async function healthcheckRoutes(server: FastifyInstance) {
  /**
   * GET /healthcheck
   * Endpoint to perform health checks.
   */
  server.get("/", healthCheckHandler)
}

/**
 * Exports the function that configures healthcheck routes.
 */
export default healthcheckRoutes
