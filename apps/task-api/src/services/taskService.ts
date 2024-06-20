// Import custom module
import Task, { TaskInput, TaskOutput } from "../models/taskModel"

/**
 * Service class for handling tasks.
 */
export class TaskService {
  /**
   * Creates a new task with the provided data.
   *
   * @param {TaskInput} taskData - The data for creating the task.
   * @returns {Promise<TaskOutput>} A promise that resolves to the created task.
   */
  async taskCreate(taskData: TaskInput): Promise<TaskOutput> {
    const task = await Task.create({ ...taskData })
    return task
  }

  /**
   * Updates an existing task with the provided data.
   *
   * @param {TaskInput} taskData - The data for updating the task.
   * @returns {Promise<TaskOutput>} A promise that resolves to the updated task.
   */
  async taskUpdate(taskData: TaskInput): Promise<TaskOutput> {
    const task = await Task.create({ ...taskData })
    return task
  }
}
