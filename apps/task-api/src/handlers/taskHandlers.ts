import { FastifyRequest, FastifyReply } from "fastify"
import { JwtTokenData, ParamGeneric, Task, TaskAssignUser, TaskQueryParams, TaskStatusUpdate } from "../types/default"
import { ErrorHandler } from "../helpers/errorHandler"
import { HttpError, TaskListFilters } from "../types/interfaces"
import { TaskService } from "../services/taskService"
import { UserService } from "../services/userService"
import { LabelService } from "../services/labelService"
import { LabelModel } from "../models/labels"
import { TaskLabelService } from "../services/taskLabelService"
import { TaskLabelModel } from "../models/taskLabels"

export class TaskHandler{
  private taskService: TaskService
  private errorHandler: ErrorHandler

  constructor(taskService: TaskService, errorHandler: ErrorHandler) {
    this.taskService = taskService
    this.errorHandler = errorHandler
  }
  taskCreateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as JwtTokenData
      const taskData = Object.assign(request.body as Task, { userId }) as Task
      const result = await this.taskService.taskCreateService(taskData)
      if(!result) throw {statusCode: 400, message: "Failed to create task"} as HttpError
      reply.status(201).send({message: "Task created"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskListHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get query params
      const queryParams = request.query as TaskQueryParams
      const filters: TaskListFilters = {
        status: queryParams.status as string | undefined,
        priorityOrder: queryParams.priorityOrder as string | undefined,
        dueDateOrder: queryParams.dueDateOrder as string | undefined,
      };
      const { userId } = request.user as JwtTokenData
      const tasks = await this.taskService.taskListService(userId, filters)
      reply.status(200).send({tasks})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskGetOneHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      const task = await this.taskService.taskGetOneService(userId, id)
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "Task found", task})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskAssignUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = request.body as TaskAssignUser
      console.log(payload)
      const userToAssign = payload.userId
      
      //  check if user exists
      const userService = new UserService()
      const user = await userService.userGetOneByID(userToAssign)
      if(!user) throw {statusCode: 404, message: "User not found"} as HttpError
      
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      const task = await this.taskService.taskUpdateService({userId: userToAssign} as Task, userId, id)
      
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "User assigned"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskDeleteHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {      
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      const task = await this.taskService.taskDeleteOneService(userId, id)
      
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "Task removed"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskStatusHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { status } = request.body as TaskStatusUpdate
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      const task = await this.taskService.taskUpdateService({status} as Task, userId, id)
      
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "Task status updated"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskUpdateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const taskData = request.body as Task
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      const task = await this.taskService.taskUpdateService(taskData, userId, id)
      
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "Task details updated"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  taskLabelAddHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = request.body as string[]
      const labels = payload.map(label=>({label: label})) as LabelModel[]
      console.log(labels)
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric

      // Validate task belongs to user
      const task = await this.taskService.taskGetOneService(userId, id)
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError

      // I attempted to do a insert on conflict update to return all ids in a single query
      // mysql doesnt support this as postgres does. Solution is to insert then select 
      // Reason to let the database deal with duplication is to avoid concurrency issues
      // Create labels

      const labelService = new LabelService()

      await labelService.labelUpsertMany(labels)

      // Create list of label names
      const labelsToFecth = labels.map(obj => obj.label)
      // Select all labels for insert
      const labelIDs = await labelService.labelIdByLabels(labelsToFecth)

      // Create an array of TaskLabelModel
      const taskLabels = labelIDs.map(o=>({taskId: id, labelId: o.id} as unknown as TaskLabelModel)) as TaskLabelModel[]
      const taskLabelService = new TaskLabelService()
      await taskLabelService.taskLabelUpsert(taskLabels)
      
      reply.status(200).send({message: "Labels assigned to task"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
}