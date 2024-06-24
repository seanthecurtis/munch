import { FastifyReply } from "fastify"
import { HttpError } from "../../src/types/interfaces"

export class ErrorHandler{
  httpErrorHandler = async (reply: FastifyReply, err: HttpError)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    return reply.status(statusCode).send({message})
  }
}