import Fastify from "fastify"
import fjwt from "@fastify/jwt"
import fCookie from "@fastify/cookie"
import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import { EnvVariables, AuthFunction } from "./types/default"
import taskRoutes from "./routes/taskRoutes"
import { taskCreateSchema, taskUpdateSchema, userLoginSchema, userRegisterSchema } from "./schemas/schemas"
import healthcheckRoutes from "./routes/healthCheckRoutes"
import userRoutes from "./routes/userRoutes"

// Initialize AJV instance for payload validation
const ajv = new Ajv({
  allErrors: true, // Enable detailed error messages for all validation errors
  coerceTypes: true, // Automatically attempt to coerce data types to match the schema
})
ajvErrors(ajv) // Apply better error messages for AJV validation

/**
 * Function to build and configure the Fastify server instance.
 * @param env - Environment variables used for configuration.
 * @param authFunction - Authentication function to be decorated on the server instance.
 * @returns Configured Fastify server instance.
 */
function buildServer(env: EnvVariables, authFunction: AuthFunction) {
  // Create Fastify server instance
  const server = Fastify({
    logger: env.ENABLE_LOGGING, // Enable logging based on environment configuration
    ajv: {
      customOptions: { allErrors: true }, // Customize AJV options for validation
      plugins: [ajvErrors], // Use ajv-errors plugin for better error handling
    },
  })

  // Pre-handler hook to validate API key
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

  // Pre-handler hook to add JWT instance to request object
  server.addHook("preHandler", (request, _, next) => {
    request.jwt = server.jwt // Attach JWT instance to request object
    return next()
  })

  // Decorate the server instance with the authentication function
  server.decorate("authenticate", authFunction)

  // Register healthcheck routes with a specific prefix
  server.register(healthcheckRoutes, { prefix: "healthcheck" })

  // Register user routes with a specific prefix
  server.register(userRoutes, { prefix: "api/users" })

  // Register task routes with a specific prefix
  server.register(taskRoutes, { prefix: "api/tasks" })

  // Register JWT plugin with server instance
  server.register(fjwt, { secret: env.JWT_TOKEN })

  // Register cookie plugin with server instance
  server.register(fCookie, {
    secret: env.COOKIE_SECRET, // Use secret from environment for cookie encryption
    hook: "preHandler", // Execute cookie plugin before handling requests
  })

  // Add schemas for payload validation
  server.addSchema(userRegisterSchema) // Add schema for user registration
  server.addSchema(userLoginSchema) // Add schema for user login
  server.addSchema(taskCreateSchema) // Add schema for task creation
  server.addSchema(taskUpdateSchema) // Add schema for task update

  return server // Return configured Fastify server instance
}

export default buildServer // Export buildServer function as default
