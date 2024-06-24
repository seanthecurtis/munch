import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { TaskHandler } from "../handlers/taskHandlers"
import { taskAssignSchema, taskCreateSchema, taskStatusSchema, taskTagSchema, taskUpdateSchema } from "../schemas/schema"
import { AuthMiddleware } from "../helpers/auth"

export class TaskRouter{
  private taskHandler: TaskHandler
  private authMiddleware: AuthMiddleware
  constructor(taskHandler: TaskHandler, authMiddleware: AuthMiddleware){
    this.taskHandler = taskHandler
    this.authMiddleware = authMiddleware
  }
  taskRoutes = async (fastify: FastifyInstance) => {
    fastify.post("/", {
      preHandler: this.authMiddleware.authenticate, 
      schema: taskCreateSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskCreateHandler(request, reply)
    })

    fastify.get("/", {
      preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskListHandler(request, reply)
    })

    fastify.get("/:id", {
      preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskGetOneHandler(request, reply)
    })

    fastify.delete("/:id", {
      preHandler: this.authMiddleware.authenticate}, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskDeleteHandler(request, reply)
    })

    fastify.put("/assign/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskAssignSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskAssignUserHandler(request, reply)
    })

    fastify.put("/status/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskStatusSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskStatusHandler(request, reply)
    })

    fastify.put("/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskUpdateSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskUpdateHandler(request, reply)
    })

    fastify.put("/tag/:id", {
      preHandler: this.authMiddleware.authenticate,
      schema: taskTagSchema
    }, async(request: FastifyRequest, reply: FastifyReply)=>{
      await this.taskHandler.taskLabelAddHandler(request, reply)
    })
    
  }
}
