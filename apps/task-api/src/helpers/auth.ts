import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { JwtTokenData } from "../types/default"
import { HttpError } from "../types/interfaces"
import { ErrorHandler } from "./errorHandler"

export class AuthMiddleware{
  private server: FastifyInstance
  private errorHandler: ErrorHandler
  constructor(server: FastifyInstance, errorHandler: ErrorHandler){
    this.server = server
    this.errorHandler = errorHandler
  }
  authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      let token = request.cookies.access_token
      if(!token && request.headers.authorization) {
        const bearerPrefix = "Bearer "
        if (request.headers.authorization.startsWith(bearerPrefix)) {
          token = request.headers.authorization.substring(bearerPrefix.length)
        }
      }
      if(!token) throw {statusCode: 401, message: "Unauthorized"} as HttpError
      // Verify the token
      const decoded = this.server.jwt.verify(token)
      request.user = decoded as JwtTokenData
      if (!request.user) throw new Error("Invalid token data")
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
  jwtSign = async (jwtTokenData: JwtTokenData, expiresIn: string, reply: FastifyReply): Promise<string | null> => {
    const token = this.server.jwt.sign(jwtTokenData as JwtTokenData,{expiresIn})
    if(!token) return null
    reply.setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })

    return token
  }
}
