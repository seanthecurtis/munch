// Import dependencies
import { FastifyInstance } from "fastify"
import { EnvVariables } from "../types/default"

// Configure Swagger
export default function configureSwagger(server: FastifyInstance, env: EnvVariables) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  server.register(require("fastify-swagger"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "Task Manager",
        description: "Munch Task Manager API Documentation",
        version: "1.0.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      host: `${env.API_URL}`,
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
    exposeRoute: true,
  })
}
