import Fastify from "fastify"
import healthcheckRoutes from "./routes/healthCheckRoutes"
import userRoutes from "./routes/userRoutes"
import fjwt from "@fastify/jwt"
import fCookie from "@fastify/cookie"
import { EnvVariables, AuthFunction } from "./types/default"
import taskRoutes from "./routes/taskRoutes"
import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import { taskCreateSchema, taskUpdateSchema, userLoginSchema, userRegisterSchema } from "./schemas/schemas"

const ajv = new Ajv({
  allErrors: true, // Report all errors in validation
  coerceTypes: true, // Coerce JSON types to match schema types
})
ajvErrors(ajv)

function buildServer(env: EnvVariables, authFunction: AuthFunction) {
  const server = Fastify({
    logger: env.ENABLE_LOGGING,
    ajv: {
      customOptions: { allErrors: true },
      plugins: [ajvErrors],
    }
  })

  // api-key validation
  server.addHook("preHandler", async (request, reply) => {
    // Enhancement is to keep a store of allowed keys, possibly redis store, and validate against a store of api_keys
    const allowedKeys = new Set([
      "7d620176-966f-4bad-a8a9-d8d493bf35d8",
      "5cfff48b-55ec-49fb-a324-af38a21a6de6"
    ])
    const apiKey = request.headers["x-api-key"] as string
    if (!apiKey || !allowedKeys.has(apiKey)) {
      reply.status(401).send({ message: "Unauthorized" })
      throw new Error("Unauthorized")
    }
  })

  // jwt
  server.addHook("preHandler", (request, _, next) => {
    request.jwt = server.jwt
    return next()
  })

  server.decorate("authenticate", authFunction)

  // endpoints
  server.register(healthcheckRoutes, { prefix: "healthcheck" })
  server.register(userRoutes, { prefix: "api/users" })
  server.register(taskRoutes, { prefix: "api/tasks" })
  // jwt
  server.register(fjwt, { secret: env.JWT_TOKEN })
  // cookies
  server.register(fCookie, {
    secret: env.COOKIE_SECRET,
    hook: "preHandler",
  })

  // schemas
  server.addSchema(userRegisterSchema)
  server.addSchema(userLoginSchema)
  server.addSchema(taskCreateSchema)
  server.addSchema(taskUpdateSchema)

  return server
}

export default buildServer