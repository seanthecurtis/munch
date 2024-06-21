import { FastifyReply, FastifyRequest } from "fastify"
import { checkHealth } from "../services/healthCheckService"

/**
 * Controller function for handling health check requests.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function healthCheckHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const state = await checkHealth()
    if (state) {
      return reply.status(200).send("OK")
    }
    return reply.status(500).send("Not OK")
  } catch (err) {
    return reply.status(500).send("Not OK")
  }
}
