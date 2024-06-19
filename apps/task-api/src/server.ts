import Fastify from "fastify"
import healthcheckRoutes from "./routes/healthCheckRoutes"
import userRoutes from "./routes/userRoutes"

function buildServer(logger: boolean) {
  const server = Fastify({
    logger: logger
  })

  server.register(healthcheckRoutes, { prefix: "healthcheck" })
  server.register(userRoutes, { prefix: "api/users" })

  return server
}

export default buildServer