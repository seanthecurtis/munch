import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { TaskHandler } from "../handlers/taskHandlers"
import { taskAssignSchema, taskCreateSchema, taskStatusSchema, taskTagSchema, taskUpdateSchema } from "../schemas/schema"
import { AuthMiddleware } from "../helpers/auth"

// Define all task routes at: /api/tasks/{route}
export class TaskRouter{
  private taskHandler: TaskHandler
  private authMiddleware: AuthMiddleware
  
  // Construct handler with dependencies
  constructor(taskHandler: TaskHandler, authMiddleware: AuthMiddleware){
    this.taskHandler = taskHandler
    this.authMiddleware = authMiddleware
  }
  // Task routes require the authentication middleware - used to validate cookies/bearer tokens
  taskRoutes = async (fastify: FastifyInstance) => {
    
    // Task create endpoint
    // POST /api/tasks
    fastify.post("/", {
      preHandler: this.authMiddleware.authenticate, 
      schema: taskCreateSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskCreateHandler(request, reply)
    })

    // Task list endpoint
    // GET /api/tasks
    fastify.get("/", {
      preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskListHandler(request, reply)
    })

    // Task fetch by id endpoint
    // POST /api/tasks/:id
    fastify.get("/:id", {
      preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskGetOneHandler(request, reply)
    })

    // Task removal endpoint
    // DELETE /api/tasks/:id
    fastify.delete("/:id", {
      preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskDeleteHandler(request, reply)
    })

    // Assign user to task endpoint
    // PUT /api/tasks/assign/:id
    fastify.put("/assign/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskAssignSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskAssignUserHandler(request, reply)
    })

    // Task status update endpoint
    // PUT /api/tasks/status/:id
    fastify.put("/status/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskStatusSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskStatusHandler(request, reply)
    })

    // Task detail update endpoint
    // PUT /api/tasks/:id
    fastify.put("/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskUpdateSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskUpdateHandler(request, reply)
    })

    // Task add label endpoint
    // POST /api/tasks/tag/:id
    fastify.put("/tag/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskTagSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskLabelAddHandler(request, reply)
    })
  }
}
