import Fastify, { FastifyReply, FastifyRequest } from "fastify"
import healthcheckRoutes from "./routes/healthCheckRoutes"
import userRoutes from "./routes/userRoutes"
import { userRegisterSchema } from "./schemas/userSchema"
import fjwt, { FastifyJWT } from "@fastify/jwt"
import fCookie from "@fastify/cookie"
import { EnvVariables } from "./types/default"

function buildServer(env: EnvVariables) {
  const server = Fastify({
    logger: env.ENABLE_LOGGING
  })

  server.register(healthcheckRoutes, { prefix: "healthcheck" })
  server.register(userRoutes, { prefix: "api/users" })
  server.addSchema(userRegisterSchema)

  // api-key validation
  server.addHook("preHandler", async (request, reply) => {
    // Enhancement is to keep a store of allowed keys, possibly redis store, and validate against a store of api_keys
    const allowedKeys = ["7d620176-966f-4bad-a8a9-d8d493bf35d8", "5cfff48b-55ec-49fb-a324-af38a21a6de6"]
    const apiKey = request.headers["x-api-key"];
    if (!apiKey || apiKey !== env.API_KEY) {
      reply.status(401).send({ message: "Unauthorized" });
      throw new Error("Unauthorized");
    }
  });

  // jwt
  server.register(fjwt, { secret: env.JWT_TOKEN })
  server.addHook("preHandler", (request, _, next) => {
    request.jwt = server.jwt
    return next()
  })
  // cookies
  server.register(fCookie, {
    secret: "some-secret-key",
    hook: "preHandler",
  })

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.access_token
      console.log(token)
      if (!token) {
        return reply.status(401).send({ message: "Authentication required" })
      }
      // here decoded will be a different type by default but we want it to be of user-payload type
      const decoded = request.jwt.verify<FastifyJWT["user"]>(token)
      request.user = decoded
      console.log(request.user)
    },
  )

  return server
}

export default buildServer