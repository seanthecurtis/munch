import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { AuthHandler } from "../handlers/authHandlers"
import { userRegisterSchema, userLoginSchema } from "../schemas/schema"

export class AuthRouter{
  private authHandler: AuthHandler
  constructor(authHandler: AuthHandler){
    this.authHandler = authHandler
  }
  authRoutes = async (fastify: FastifyInstance) => {
    fastify.post("/register", {schema: userRegisterSchema }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.authHandler.registerHandler(request, reply)
    })
    fastify.post("/login", {schema: userLoginSchema }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.authHandler.loginHandler(request, reply)
    })
  }
}
