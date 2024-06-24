import { FastifyReply } from "fastify"
import { HttpError } from "../types/interfaces"

export class ErrorHandler{
  httpErrorHandler = async (reply: FastifyReply, err: HttpError)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    console.error(err)
    return reply.status(statusCode).send({message})
  }
}