import Task, { TaskInput, TaskOutput } from "../models/taskModel";

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
    const task = await Task.create({ ...taskData });
    return task;
  }

  /**
   * Updates an existing task with the provided data.
   *
   * @param {string} userId - Logged in users id
   * @param {string} id - Task id to update
   * @param {Partial<TaskInput>} taskData - The data for updating the task.
   * @returns {Promise<TaskOutput>} A promise that resolves to the updated task.
   */
  async taskUpdate(userId: string, id: string, taskData: Partial<TaskInput>): Promise<TaskOutput> {
    // Schema is stopping any other fields from being passed through, 
    // this is another level of data integrity check - in case another operation accesses this function
    const sanitizedData = pickAllowedFields(taskData, ['title', 'description', 'dueDate', 'priority', 'status']);
    const [updatedRows] = await Task.update(sanitizedData, { where: { id, userId } });
    if (updatedRows === 0) {
      throw new Error("Failed to update task");
    }
    const task = await Task.findByPk(id); // Retrieve the updated task
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  /**
   * Retrieves a list of tasks for the logged in user
   *
   * @param {string} userId - Logged in users id
   * @param {Partial<TaskInput>} filters - The data for updating the task.
   * @returns {Promise<TaskOutput[]>} A promise that resolves to the list of tasks.
   */
  async taskList(userId: string, filters: Partial<TaskInput> = {}): Promise<TaskOutput[]> {
    const where = { userId, ...filters };
    const tasks = await Task.findAll({ where });
    if (!tasks.length) {
      throw new Error("No tasks found");
    }
    return tasks;
  }

  /**
   * Retrieves a task for the logged in user by task id
   *
   * @param {string} userId - Logged in users id
   * @param {string} id - The task id
   * @returns {Promise<TaskOutput>} A promise that resolves to the task.
   */
  async taskGetOneById(userId: string, id: string): Promise<TaskOutput> {
    const where = { userId, id };
    const task = await Task.findOne({ where });
    if (!task) {
      throw new Error("Failed to retrieve task");
    }
    return task;
  }

  /**
   * Deletes a task by id for the logged in user
   *
   * @param {string} userId - Logged in users id
   * @param {string} id - The task id
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the task was deleted.
   */
  async deleteTaskById(userId: string, id: string): Promise<boolean> {
    const where = { userId, id };
    const deletedRows = await Task.destroy({ where });
    return deletedRows > 0;
  }

   /**
   * Updates an existing task with the provided data.
   *
   * @param {string} userId - Logged in users id
   * @param {string} id - Task id to update
   * @param {Partial<TaskInput>} taskData - The data for updating the task.
   * @returns {Promise<TaskOutput>} A promise that resolves to the updated task.
   */
   async taskAssignUser(userId: string, id: string, taskData: Partial<TaskInput>): Promise<boolean> {
    // Schema is stopping any other fields from being passed through, 
    // this is another level of data integrity check - in case another operation accesses this function
    const sanitizedData = pickAllowedFields(taskData, ['userId']);
    console.log(sanitizedData)
    const [updatedRows] = await Task.update(sanitizedData, { where: { id, userId } });
    return updatedRows > 0
  }
  
}

// Helpers
function pickAllowedFields<T>(data: Partial<T>, allowedFields: (keyof T)[]): Partial<T> {
  const sanitizedData: Partial<T> = {};
  for (const key of allowedFields) {
    if (key in data) {
      sanitizedData[key] = data[key];
    }
  }
  return sanitizedData;
}
