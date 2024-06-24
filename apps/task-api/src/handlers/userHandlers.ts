import { FastifyRequest, FastifyReply } from "fastify"
import { UserFilters } from "../types/default"
import { ErrorHandler } from "../helpers/errorHandler"
import { HttpError } from "../types/interfaces"
import { UserService } from "../services/userService"

export class UserHandler{
  private userService: UserService
  private errorHandler: ErrorHandler

  constructor(userService: UserService, errorHandler: ErrorHandler) {
    this.userService = userService
    this.errorHandler = errorHandler
  }
  userListHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const filters = request.query as UserFilters
      const users = await this.userService.userList(filters)
      reply.status(200).send({users})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
}

