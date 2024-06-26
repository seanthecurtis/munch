import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { AuthHandler } from "../handlers/authHandlers"
import { userRegisterSchema, userLoginSchema } from "../schemas/schema"

// Define all auth routes at: /api/{route}
export class AuthRouter{
  private authHandler: AuthHandler
  
  // Construct handler with dependencies
  constructor(authHandler: AuthHandler){
    this.authHandler = authHandler
  }
  // Auth routes bypass the authentication middleware
  authRoutes = async (fastify: FastifyInstance) => {
    // Registration endpoint
    // POST /api/register
    fastify.post("/register", {schema: userRegisterSchema }, async(request: FastifyRequest, reply: FastifyReply)=>{
      console.log(request.body)
      await this.authHandler.registerHandler(request, reply)
    })
    // Login endpoint
    // POST /api/login
    fastify.post("/login", {schema: userLoginSchema }, async(request: FastifyRequest, reply: FastifyReply)=>{
      console.log(request.body)
      await this.authHandler.loginHandler(request, reply)
    })
  }
}
