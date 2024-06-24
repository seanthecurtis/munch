import { TaskLabelModel } from "../models/taskLabels"

export class TaskLabelService {
  taskLabelUpsert = async (taskLabels: TaskLabelModel[]): Promise<TaskLabelModel[]> => {
    console.log(taskLabels)
    try{
      return await TaskLabelModel.bulkCreate(taskLabels, {ignoreDuplicates: true})
    }catch(err){ 
      return []
    }
  }
}
