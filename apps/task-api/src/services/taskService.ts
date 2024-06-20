import Task, { TaskInput, TaskOutput } from "../models/taskModel"

export class TaskService {
  // /api/tasks/
  // Create task
  async taskCreate(taskData: TaskInput): Promise<TaskOutput> {
    const task = await Task.create({...taskData})
    return task
  }

  async taskUpdate(taskData: TaskInput): Promise<TaskOutput> {
    const task = await Task.create({...taskData})
    return task
  }
}

