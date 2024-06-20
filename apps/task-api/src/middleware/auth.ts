import { FastifyReply, FastifyRequest } from "fastify"
import { FastifyJWT } from "@fastify/jwt"

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  let token: string | undefined

  // Check if token is in cookies
  if (request.cookies && request.cookies.access_token) {
    token = request.cookies.access_token
  }

  // Check if token is in authorization header (Bearer token)
  if (!token && request.headers.authorization) {
    const authHeader = request.headers.authorization
    const bearerPrefix = "Bearer "
    if (authHeader.startsWith(bearerPrefix)) {
      token = authHeader.substring(bearerPrefix.length)
    }
  }

  // If no token found, return 401 Unauthorized
  if (!token) {
    return reply.status(401).send({ message: "Unauthorized" })
  }

  try {
    // Verify and decode the token
    const decoded = request.jwt.verify<FastifyJWT["user"]>(token)
    request.user = decoded
  } catch (err) {
    // Handle token verification errors
    return reply.status(401).send({ message: "Unauthorized" })
  }
}
