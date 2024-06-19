import Fastify from "fastify"
import healthcheckRoutes from "./routes/healthCheckRoutes"

function buildServer(logger: boolean) {
  const server = Fastify({
    logger: logger
  })

  server.register(healthcheckRoutes, { prefix: "healthcheck" })

  return server
}

export default buildServer