import { FastifyRequest, FastifyReply } from "fastify"
import { JwtTokenData, ParamGeneric, Task, TaskQueryParams, TaskStatusUpdate, TaskListFilters, Label } from "../types/default"
import { ErrorHandler } from "../helpers/errorHandler"
import { HttpError } from "../types/interfaces"
import { TaskService } from "../services/taskService"
import { UserService } from "../services/userService"
import { LabelService } from "../services/labelService"
import { TaskLabelService } from "../services/taskLabelService"
import { TaskLabelModel } from "../models/taskLabels"

// Class to handle all task api business logic
export class TaskHandler{
  private taskService: TaskService
  private errorHandler: ErrorHandler

  // Construct handler with dependencies
  constructor(taskService: TaskService, errorHandler: ErrorHandler) {
    this.taskService = taskService
    this.errorHandler = errorHandler
  }
  // Handles task create logic
  taskCreateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as JwtTokenData
      
      // Assign the logged in user by default
      const taskData = Object.assign(request.body as Task, { userId }) as Task
      
      const result = await this.taskService.taskCreateService(taskData)
      
      if(!result) throw {statusCode: 400, message: "Failed to create task"} as HttpError
      
      reply.status(201).send({message: "Task created", id: result.id})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  // Return a list of tasks assigned to the logged in user
  taskListHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get query params
      const queryParams = request.query as TaskQueryParams
      // Get the filters from query params
      const filters = {
        status: queryParams.status,
        priorityOrder: queryParams.priorityOrder,
        dueDateOrder: queryParams.dueDateOrder
      } as TaskListFilters
      const { userId } = request.user as JwtTokenData
      // Query the database with filters/sorting
      const tasks = await this.taskService.taskListService(userId, filters)
      reply.status(200).send({tasks})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  // Fetch a single task from the database
  // Make sure only the logged in user can view the task
  taskGetOneHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric

      const task = await this.taskService.taskGetOneService(userId, id)
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError

      const labelService = new LabelService
      const labels = await labelService.labelsByTask(id)

      // Attach labels to task object
      task.labels = labels

      reply.status(200).send({message: "Task found", task})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  // Assign a task to another user
  taskAssignUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = request.body as {userId: string }
      const userToAssign = payload.userId
      
      // Check if user exists
      const userService = new UserService()
      const user = await userService.userGetOneByID(userToAssign)
      if(!user) throw {statusCode: 404, message: "User not found"} as HttpError
      
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      // Attach logged in user to the query
      // Assign task from logged in user to provided user id
      const task = await this.taskService.taskUpdateService({userId: userToAssign} as Task, userId, id)
      
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "User assigned"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  // Handles removing a task
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

  // Handles status update of a task
  taskStatusHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { status } = request.body as TaskStatusUpdate
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      // Only assigned user can update task data
      const task = await this.taskService.taskUpdateService({status} as Task, userId, id)
      
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "Task status updated"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  // Handles update of a tasks details
  taskUpdateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const taskData = request.body as Task
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric
      // Only assigned user can update task data
      const task = await this.taskService.taskUpdateService(taskData, userId, id)
      // For security do not return who the task is assigned to - this could be sensitive information?
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError
      reply.status(200).send({message: "Task details updated"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }

  // Add a list of labels to a task
  taskLabelAddHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = request.body as string[]
      const labels = payload.map(label=>({label: label})) as Label[]
      const { userId } = request.user as JwtTokenData
      const {id} = request.params as ParamGeneric

      // Validate task belongs to user
      const task = await this.taskService.taskGetOneService(userId, id)
      if(!task) throw {statusCode: 404, message: "Task not found"} as HttpError

      // I attempted to do a insert on conflict update to return all ids in a single query
      // mysql doesnt support this as postgres does. Solution is to insert then select 
      // Reason for letting the database deal with duplication is to avoid concurrency issues
      
      const labelService = new LabelService()
      // Create labels
      await labelService.labelUpsertMany(labels)

      // Create list of label names
      const labelsToFecth = labels.map(obj => obj.label)
      // Select all labels for insert
      const labelIDs = await labelService.labelIdByLabels(labelsToFecth)

      // Assign all the labels to the task
      const taskLabels = labelIDs.map(o=>({taskId: id, labelId: o.id} as unknown as TaskLabelModel)) as TaskLabelModel[]
      const taskLabelService = new TaskLabelService()
      await taskLabelService.taskLabelUpsert(taskLabels)
      
      reply.status(200).send({message: "Labels assigned to task"})
    } catch (err) {
      await this.errorHandler.httpErrorHandler(reply, err as HttpError)
    }
  }
}