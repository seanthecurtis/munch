import { TaskLabelModel } from "../models/taskLabels"
import { TaskLabel } from "../types/default"

// Class to manage all task_label related database interaction
export class TaskLabelService {
  // Bulk create map between tasks and labels - avoids duplication
  taskLabelUpsert = async (taskLabels: TaskLabelModel[]): Promise<TaskLabel[]> => {
    try{
      const labels = await TaskLabelModel.bulkCreate(taskLabels, {ignoreDuplicates: true})
      const output = labels.map(o => o.toJSON())
      return output
    }catch(err){
      return []
    }
  }
}
