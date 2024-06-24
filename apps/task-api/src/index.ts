import fastify, { FastifyReply, FastifyRequest } from "fastify"
import sequelize from "./database/sequelize"
import { serverConfig } from "./helpers/config"
import { Router } from "./routes/router"
import { fastifyCookie } from "@fastify/cookie"
import fastifyJwt from "@fastify/jwt"
import Ajv from "ajv"
import ajvErrors from "ajv-errors"

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
})
ajvErrors(ajv)

const server = fastify({ 
  logger: true,
  ajv: {
    customOptions: { allErrors: true },
    plugins: [ajvErrors],
  }
})

const start = async () => {
  try {
    await sequelize.sync({alter: true})

    // add healcheck api
    server.get("/healthcheck", async(_: FastifyRequest, reply: FastifyReply)=>{
      reply.status(200).send({status: "OK", message: "Much task manager API"})
    })

    // Validate api keys on request
    server.addHook("onRequest", async (request, reply) => {
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

    server.register(fastifyCookie, {
      secret: "your-secret-key",
      parseOptions: {},
      hook: "preHandler"
    })
    
    server.register(fastifyJwt, {
      secret: "your-jwt-secret-key",
      cookie: {
        cookieName: "access_token",
        signed: true
      }
    })

    // add routes here
    const router = new Router(server)
    router.routerSetup()

    await server.listen({port:serverConfig.port, host: serverConfig.host})
  } catch (err) {
    console.error(err)
    server.log.error(err)
    process.exit(1)
  }
}

start()
