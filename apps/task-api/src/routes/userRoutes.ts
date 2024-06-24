import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { UserHandler } from "../handlers/userHandlers"
import { AuthMiddleware } from "../helpers/auth"

export class UserRouter{
  private userHandler: UserHandler
  private authMiddleware: AuthMiddleware
  constructor(userHandler: UserHandler, authMiddleware: AuthMiddleware){
    this.userHandler = userHandler
    this.authMiddleware = authMiddleware
  }
  userRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/", {preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.userHandler.userListHandler(request, reply)
    })
  }
}
