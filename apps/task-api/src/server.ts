// Import dependencies
import Fastify from "fastify"
import healthcheckRoutes from "./routes/healthCheckRoutes"
import userRoutes from "./routes/userRoutes"
import fjwt from "@fastify/jwt"
import fCookie from "@fastify/cookie"
import Ajv from "ajv"
import ajvErrors from "ajv-errors"

// Import custom modules and types
import { EnvVariables, AuthFunction } from "./types/default"
import taskRoutes from "./routes/taskRoutes"
import { taskCreateSchema, taskUpdateSchema, userLoginSchema, userRegisterSchema } from "./schemas/schemas"

// Include AJV for payload validation
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
})
ajvErrors(ajv)

/**
 * Builds and configures the Fastify server.
 *
 * @param {EnvVariables} env - The environment variables for configuration.
 * @param {AuthFunction} authFunction - The authentication function to use.
 * @returns {Fastify.FastifyInstance} The configured Fastify server instance.
 */
function buildServer(env: EnvVariables, authFunction: AuthFunction) {
  const server = Fastify({
    logger: env.ENABLE_LOGGING,
    ajv: {
      customOptions: { allErrors: true },
      plugins: [ajvErrors],
    },
  })

  /**
   * Pre-handler hook for API key validation.
   *
   * @param {Fastify.FastifyRequest} request - The incoming request object.
   * @param {Fastify.FastifyReply} reply - The reply object.
   * @throws {Error} If the API key is not valid.
   */
  server.addHook("preHandler", async (request, reply) => {
    const allowedKeys = new Set([
      "7d620176-966f-4bad-a8a9-d8d493bf35d8",
      "5cfff48b-55ec-49fb-a324-af38a21a6de6",
    ])
    const apiKey = request.headers["x-api-key"] as string
    if (!apiKey || !allowedKeys.has(apiKey)) {
      reply.status(401).send({ message: "Unauthorized" })
      throw new Error("Unauthorized")
    }
  })

  /**
   * Pre-handler hook for JWT initialization.
   *
   * @param {Fastify.FastifyRequest} request - The incoming request object.
   * @param {any} _ - The reply object (not used).
   * @param {Function} next - The next middleware function.
   */
  server.addHook("preHandler", (request, _, next) => {
    request.jwt = server.jwt
    return next()
  })

  // Decorate the server instance with the authentication function
  server.decorate("authenticate", authFunction)

  // Register routes with prefixes
  server.register(healthcheckRoutes, { prefix: "healthcheck" })
  server.register(userRoutes, { prefix: "api/users" })
  server.register(taskRoutes, { prefix: "api/tasks" })

  // Register JWT plugin
  server.register(fjwt, { secret: env.JWT_TOKEN })

  // Register cookie plugin
  server.register(fCookie, {
    secret: env.COOKIE_SECRET,
    hook: "preHandler",
  })

  // Add schemas for validation
  server.addSchema(userRegisterSchema)
  server.addSchema(userLoginSchema)
  server.addSchema(taskCreateSchema)
  server.addSchema(taskUpdateSchema)

  return server
}

export default buildServer
