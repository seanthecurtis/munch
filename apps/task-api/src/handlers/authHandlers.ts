import { FastifyRequest, FastifyReply } from "fastify"
import { JwtTokenData, User } from "../types/default"
import { ErrorHandler } from "../helpers/errorHandler"
import { HttpError } from "../types/interfaces"
import { AuthService } from "../services/authService"
import { AuthMiddleware } from "../helpers/auth"

export class AuthHandler{
  private authService: AuthService
  private authMiddleware: AuthMiddleware
  private errorHandler: ErrorHandler

  constructor(authService: AuthService, authMiddleware: AuthMiddleware, errorHandler: ErrorHandler) {
    this.authService = authService
    this.authMiddleware = authMiddleware
    this.errorHandler = errorHandler
  }
  registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.authService.registerService(request.body as User)
      if(!result) throw {statusCode: 400, message: "User registration failed"} as HttpError
      reply.status(201).send({message: "User registered"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
  
  loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await this.authService.loginService(request.body as User)
      if(!user) throw {statusCode: 401, message: "Invalid login credentials"} as HttpError
      const token = await this.authMiddleware.jwtSign({userId: user.id} as JwtTokenData, "1h", reply)
      if(!token) throw {statusCode: 500, message: "Failed to generate access_token"} as HttpError
      reply.status(200).send({access_token: token})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
}

