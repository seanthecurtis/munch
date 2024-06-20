import Fastify, { FastifyReply, FastifyRequest } from "fastify"
import healthcheckRoutes from "./routes/healthCheckRoutes"
import userRoutes from "./routes/userRoutes"
import fjwt, { FastifyJWT } from "@fastify/jwt"
import fCookie from "@fastify/cookie"
import { EnvVariables } from "./types/default"
import taskRoutes from "./routes/taskRoutes"
import { Schemas } from "./schemas/schemas"

function buildServer(env: EnvVariables) {
  const server = Fastify({
    logger: env.ENABLE_LOGGING
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

  // jwt validation
  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.access_token
      console.log(token)
      if (!token) {
        return reply.status(401).send({ message: "Authentication required" })
      }
      const decoded = request.jwt.verify<FastifyJWT["user"]>(token)
      request.user = decoded
      console.log(request.user)
    },
  )

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
  for (const schema of [...Schemas]) {
    server.addSchema(schema)
  }

  return server
}

export default buildServer