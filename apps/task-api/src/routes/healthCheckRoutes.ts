/**
 * Import dependencies
 */
import { FastifyInstance } from "fastify"

/**
 * Import custom controllers
 */
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
 * Exports the healthcheck routes configuration function.
 */
export default healthcheckRoutes
