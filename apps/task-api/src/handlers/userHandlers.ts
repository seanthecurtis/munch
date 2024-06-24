import { FastifyRequest, FastifyReply } from "fastify"
import { UserQueryParams } from "../types/default"
import { ErrorHandler } from "../helpers/errorHandler"
import { HttpError } from "../types/interfaces"
import { UserService } from "../services/userService"

// Class to handle all user api business logic
export class UserHandler{
  private userService: UserService
  private errorHandler: ErrorHandler

  // Construct handler with dependencies
  constructor(userService: UserService, errorHandler: ErrorHandler) {
    this.userService = userService
    this.errorHandler = errorHandler
  }
  // List all users: to select a user to assign to a task
  userListHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const filters = request.query as UserQueryParams
      // Limit filters to email exact match for now
      // Add pagination if required - scalability issue since user table is a growing table
      const users = await this.userService.userList(filters)
      reply.status(200).send({users})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
}

