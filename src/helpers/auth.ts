import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { JwtTokenData } from "../types/default"
import { HttpError } from "../types/interfaces"
import { ErrorHandler } from "./errorHandler"

// Middleware to manage all auth related functionality
// Can be moved to a separate service if required
export class AuthMiddleware{
  private server: FastifyInstance
  private errorHandler: ErrorHandler
  constructor(server: FastifyInstance, errorHandler: ErrorHandler){
    this.server = server
    this.errorHandler = errorHandler
  }
  // Function to be used to decorate fastify routes
  // Validates cookies or authentication tokens on request
  authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      // Fech token from cookies
      let token = request.cookies.access_token
      // If no cookie present check for bearer token
      if(!token && request.headers.authorization) {
        const bearerPrefix = "Bearer "
        if (request.headers.authorization.startsWith(bearerPrefix)) {
          token = request.headers.authorization.substring(bearerPrefix.length)
        }
      }
      // Error if no token found
      if(!token) throw {statusCode: 401, message: "Unauthorized"} as HttpError
      // Verify the token
      const decoded = this.server.jwt.verify(token)
      // Attach logged in user to the request
      request.user = decoded as JwtTokenData
      if (!request.user) throw new Error("Invalid token data")
    } catch (err) {
      // Handle authentication errors
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
  // Method to create jwt token for future authentication
  jwtSign = async (jwtTokenData: JwtTokenData, expiresIn: string, reply: FastifyReply): Promise<string | null> => {
    // Generate signed jwt token
    const token = this.server.jwt.sign(jwtTokenData as JwtTokenData,{expiresIn})
    if(!token) return null
    // Add cookie to the reply
    reply.setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // Set token to 15 minutes for now - can be added to env config if it needs to be manipulated
    })

    return token
  }
}
