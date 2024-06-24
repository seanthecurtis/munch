import fastify, { FastifyReply, FastifyRequest } from "fastify"
import sequelize from "./database/sequelize"
import { serverConfig, authConfig } from "./helpers/config"
import { Router } from "./routes/router"
import { fastifyCookie } from "@fastify/cookie"
import fastifyJwt from "@fastify/jwt"
import Ajv from "ajv"
import ajvErrors from "ajv-errors"

// Add ajv to validate payload fields
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
})
ajvErrors(ajv)

// Create fastify instance
const server = fastify({ 
  logger: true,
  ajv: {
    customOptions: { allErrors: true },
    plugins: [ajvErrors],
  }
})

// Function to start the server
const start = async () => {
  try {
    // Create connection to database
    await sequelize.sync({alter: true})

    // Add healcheck api
    server.get("/healthcheck", async(_: FastifyRequest, reply: FastifyReply)=>{
      reply.status(200).send({status: "OK", message: "Much task manager API"})
    })

    // Validate api keys on request
    server.addHook("onRequest", async (request, reply) => {
      // Hard coded api keys
      // Enhancement would be to keep a store of available valid api keys to do rotation of keys
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

    // Register fastify cookies
    server.register(fastifyCookie, {
      secret: authConfig.cookieSecret,
      parseOptions: {},
      hook: "preHandler"
    })
    
    // Register fastify jwt for token verification
    server.register(fastifyJwt, {
      secret: authConfig.jwtToken as string,
      cookie: {
        cookieName: "access_token",
        signed: true
      }
    })

    // Add routes
    const router = new Router(server)
    router.routerSetup()

    // Listen on port
    await server.listen({port:serverConfig.port, host: serverConfig.host})
  } catch (err) {
    // Handle server set up errors
    console.error(err)
    server.log.error(err)
    process.exit(1)
  }
}

// Start the server
start()
