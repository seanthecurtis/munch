import { FastifyRequest, FastifyReply } from "fastify"
import { JwtTokenData, User } from "../types/default"
import { ErrorHandler } from "../helpers/errorHandler"
import { HttpError } from "../types/interfaces"
import { AuthService } from "../services/authService"
import { AuthMiddleware } from "../helpers/auth"

// Class to handle all auth api business logic
export class AuthHandler{
  private authService: AuthService
  private authMiddleware: AuthMiddleware
  private errorHandler: ErrorHandler

  // Construct handler with dependencies
  constructor(authService: AuthService, authMiddleware: AuthMiddleware, errorHandler: ErrorHandler) {
    this.authService = authService
    this.authMiddleware = authMiddleware
    this.errorHandler = errorHandler
  }
  // Handles registration logic
  registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.authService.registerService(request.body as User)
      // For security return generic error
      // If the api is internal not external can report on more specific reasons for failure
      if(!result) throw {statusCode: 400, message: "User registration failed"} as HttpError
      reply.status(201).send({message: "User registered"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
  
  // Handle login logic
  loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Fetch user from db and verify password
      const user = await this.authService.loginService(request.body as User)
      if(!user) throw {statusCode: 401, message: "Invalid login credentials"} as HttpError
      // Send the user to auth middleware to sign jwt token and create cookies
      const token = await this.authMiddleware.jwtSign({userId: user.id} as JwtTokenData, "1h", reply)
      if(!token) throw {statusCode: 500, message: "Failed to generate access_token"} as HttpError
      reply.status(200).send({access_token: token})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
}

