// Import dependencies
import { FastifyReply, FastifyRequest } from "fastify"
import { ForeignKeyConstraintError } from "sequelize"

// Import custom
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
    if (err instanceof ForeignKeyConstraintError) message = "Cannot assign user to task"
    console.error(err)
    return reply.status(400).send({ message })
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
    const taskService = new TaskService()
    const taskData = request.body as TaskInput

    const updatedTask = await taskService.taskUpdate(taskData as TaskInput)
    if (updatedTask) {
      return reply.status(200).send({ message: "Task updated successfully" })
    }
  } catch (err) {
    console.error(err)
    return reply.status(400).send({ message: "Failed to update task" })
  }
}
