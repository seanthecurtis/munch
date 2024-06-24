import { FastifyInstance } from "fastify"
import { AuthService } from "../services/authService"
import { AuthHandler } from "../handlers/authHandlers"
import { AuthRouter } from "./authRoutes"
import { TaskService } from "../services/taskService"
import { TaskHandler } from "../handlers/taskHandlers"
import { TaskRouter } from "./taskRoutes"
import { UserService } from "../services/userService"
import { UserHandler } from "../handlers/userHandlers"
import { UserRouter } from "./userRoutes"
import { AuthMiddleware } from "../helpers/auth"
import { ErrorHandler } from "../helpers/errorHandler"
import Schemas from "../schemas/schema"

export class Router{
  private server: FastifyInstance
  constructor(server: FastifyInstance){
    this.server = server
  }

  routerSetup = async() => {
    // Add schemas to fastify instance
    Schemas.forEach(schema=>this.server.addSchema(schema))
    
    // Add middleware
    const errorHandler = new ErrorHandler()
    const authMiddleware = new AuthMiddleware(this.server, errorHandler)
    // Set up auth routes
    const authService = new AuthService()
    const authHandler = new AuthHandler(authService, authMiddleware, errorHandler)
    const authRouter = new AuthRouter(authHandler)

    this.server.register(
      async (instance) => {
        await authRouter.authRoutes(instance)
      },
      { prefix: "api" }
    )

    // Set up user routes
    const userService = new UserService()
    const userHandler = new UserHandler(userService, errorHandler)
    const userRouter = new UserRouter(userHandler, authMiddleware)

    this.server.register(
      async (instance) => {
        await userRouter.userRoutes(instance)
      },
      { prefix: "api/users" }
    )

    // Set up task routes
    const taskService = new TaskService()
    const taskHandler = new TaskHandler(taskService, errorHandler)
    const taskRouter = new TaskRouter(taskHandler, authMiddleware)

    this.server.register(
      async (instance) => {
        await taskRouter.taskRoutes(instance)
      },
      { prefix: "api/tasks" }
    )
  }
}