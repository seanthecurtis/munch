import { LabelModel } from "../models/labels"
import { TaskModel } from "../models/task"
import { Task, TaskQueryParams } from "../types/default"

// Class to manage all task related database interaction
export class TaskService {
  // Insert a new task
  taskCreateService = async (taskData: Task): Promise<Task | null> => {
    try {
      return await TaskModel.create(taskData as TaskModel)
    } catch (err) {
      return null
    }
  }

  // List all tasks
  // Filters: status
  // Sorting: priority, dueDate
  taskListService = async(userId: string, filters: TaskQueryParams):Promise<Task[]> => {
    try {
      const { status, priorityOrder, dueDateOrder } = filters
      // Add default pagination for now - no spec
      const page = 1
      const limit = 50
  
      // Build where clause
      const whereClause: { userId: string; status?: string } = { userId }
      if (status) {
        whereClause.status = status
      }
  
      // Build order array for sorting
      const order: [string, string][] = [["priority", "ASC"], ["dueDate", "ASC"]]
      if (priorityOrder == "desc") {
        order[0] = ["priority", priorityOrder.toUpperCase()]
      }
      if (dueDateOrder == "desc") {
        order[1] = ["dueDate", dueDateOrder.toUpperCase()]
      }
  
      // Query database with all settings applied
      const tasks = await TaskModel.findAll({
        where: whereClause,
        order,
        limit,
        offset: (page - 1) * limit,
      })
  
      return tasks
    } catch (err) {
      return []
    }
  }

  // Fetch a single task
  // Include a list of labels assigned to the task
  taskGetOneService = async(userId: string, id: string):Promise<Task | null> => {
    try{
      return await TaskModel.findOne({
        where: { userId, id },
        include: [{
          model: LabelModel,
          through: { attributes: [] },
          attributes: ["id", "label"],
          required: false
        }]
      })
    }catch(err){
      return null
    }
  }

  // Remove a task
  taskDeleteOneService = async(userId: string, id: string):Promise<number> => {
    try{
      // Enhancement: create db transaction to manage rollbacks: scenario - more than one deleted
      return await TaskModel.destroy({where: {userId, id}})
    }catch(err){
      return 0
    }
  }

  // Update the details of a task
  taskUpdateService = async(taskData: Task, userId: string, id: string):Promise<number> => {
    try{
      const [affectedRows] = await TaskModel.update(taskData,{where: {id, userId}})
      return affectedRows
    }catch(err){
      return 0
    }
  }
}
