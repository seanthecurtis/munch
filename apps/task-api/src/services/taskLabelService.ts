import { TaskLabelModel } from "../models/taskLabels"

// Class to manage all task_label related database interaction
export class TaskLabelService {
  // Bulk create map between tasks and labels - avoids duplication
  taskLabelUpsert = async (taskLabels: TaskLabelModel[]): Promise<TaskLabelModel[]> => {
    try{
      return await TaskLabelModel.bulkCreate(taskLabels, {ignoreDuplicates: true})
    }catch(err){ 
      return []
    }
  }
}
