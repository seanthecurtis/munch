import { FastifyReply, FastifyRequest, GetParams } from "fastify"
import { ForeignKeyConstraintError } from "sequelize"
import { TaskService } from "../services/taskService"
import { TaskInput } from "../models/taskModel"

/**
 * Controller function for creating a new task.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function taskCreateHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const taskService = new TaskService()
    // Default the assigned user to the user creating the task
    const taskData = Object.assign({ userId: request.user.id }, request.body) as TaskInput

    // Ensure dueDate is a valid future date
    const isValidDateFormat = /^\d{4}-(0\d|1[0-2])-(0\d|1\d|2\d|3[01])$/.test(taskData.dueDate)
    const dueDate = new Date(taskData.dueDate)
    const currentDate = new Date()

    if (dueDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0) || !isValidDateFormat) {
      return reply.status(400).send({
        code: "FST_ERR_VALIDATION",
        error: "Bad Request",
        message: "body/dueDate must be a future date with format YYYY-MM-DD",
      })
    }

    const task = await taskService.taskCreate(taskData as TaskInput)
    if (task) {
      return reply.status(201).send({ message: "Task successfully created", id: task.id })
    }
  } catch (err) {
    let message = "Failed to create task"
    let httpStatus = 500
    if (err instanceof ForeignKeyConstraintError) {
      message = "Cannot assign user to task"
      httpStatus = 400
    }
    console.error(err)
    return reply.status(httpStatus).send({ message })
  }
}

/**
 * Controller function for updating a task.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function taskUpdateHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params as GetParams
    const taskService = new TaskService()
    const taskData = request.body as TaskInput

    // Assumption that only the assigned user can update their task
    const updatedTask = await taskService.taskUpdate(request.user.id, id, taskData as TaskInput)
    if (updatedTask) {
      return reply.status(200).send({ message: "Task updated successfully" })
    }
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to update task" })
  }
}

export async function taskListHandler(request: FastifyRequest, reply: FastifyReply): Promise<void>{
  try{
    const taskService = new TaskService()
    const taskData = request.body as TaskInput
    const tasks = await taskService.taskList(request.user.id, taskData)
    return reply.status(200).send({tasks})
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to retrieve task list" })
  }
}

export async function taskGetOneHandler(request: FastifyRequest, reply: FastifyReply): Promise<void>{
  try{
    const taskService = new TaskService()
    const { id } = request.params as GetParams
    const task = await taskService.taskGetOneById(request.user.id, id)
    return reply.status(200).send(task)
  } catch (err) {
    console.error(err)
    return reply.status(404).send({ message: "Task not found" })
  }
}

export async function taskDeleteHandler(request: FastifyRequest, reply: FastifyReply): Promise<void>{
  try{
    const taskService = new TaskService()
    const { id } = request.params as GetParams
    if(await taskService.deleteTaskById(request.user.id, id))
      return reply.status(200).send({message: "Task successfully deleted"})
    else
      return reply.status(404).send({message: "Task not found"})
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to remove task" })
  }
}

/**
 * Controller function for updating a task - assign another user.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @returns {Promise<void>} Promise representing the asynchronous operation.
 */
export async function taskAssignHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params as GetParams // task to update
    const taskService = new TaskService()
    const taskData = request.body as TaskInput // Should only update the userId

    // Assumption that only the assigned user can update their task
    const updatedTask = await taskService.taskAssignUser(request.user.id, id, taskData as TaskInput)
    if (updatedTask)
      return reply.status(200).send({ message: "User assigned to task" })
    return reply.status(404).send({ message: "Unable to assign task to user" })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Failed to update task" })
  }
}


