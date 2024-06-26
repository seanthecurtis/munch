import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { UserHandler } from "../handlers/userHandlers"
import { AuthMiddleware } from "../helpers/auth"

// Define all user routes at: /api/users/{route}
export class UserRouter{
  private userHandler: UserHandler
  private authMiddleware: AuthMiddleware
  
  // Construct handler with dependencies
  constructor(userHandler: UserHandler, authMiddleware: AuthMiddleware){
    this.userHandler = userHandler
    this.authMiddleware = authMiddleware
  }

  userRoutes = async (fastify: FastifyInstance) => {
    // User list endpoint
    // GET /api/users
    fastify.get("/", {preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.userHandler.userListHandler(request, reply)
    })
  }
}
