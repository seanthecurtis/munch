import { LabelModel } from "../models/labels"
import { TaskModel } from "../models/task"
import { Label } from "../types/default"

// Class to manage all label related database interaction
export class LabelService {
  // Insert labels, uniqueness on label column
  labelUpsertMany = async (labelArray: Label[]): Promise<Label[]> => {
    try {
      const validLabels = labelArray.filter(item => item.label !== null).map(item => ({ ...item }))
      if(validLabels.length == 0){
        return []
      }
      const labels = await LabelModel.bulkCreate(validLabels as LabelModel[], {ignoreDuplicates: true, returning: ["id"]})
      const output = labels.map(o => o.toJSON())
      return output
      // const labels = await LabelModel.bulkCreate(labelArray, {ignoreDuplicates: true, returning: ["id"]})
      // return labels as Label[]
    } catch (err) {
      return []
    }
  }

  // Fetch a list of labels with a list of label names as input
  // See taskLabelAddHandler in TaskHandler to understand why this method exists
  labelIdByLabels = async (labelArray: string[]): Promise<Label[]> => {
    try{
      const labels = await LabelModel.findAll({where: {label: labelArray}, attributes: ["id"]})
      const output = labels.map(o => o.toJSON())
      return output
    }catch(err){
      return []
    }
  }

  labelsByTask = async (taskId: string): Promise<Label[]> => {
    try{
      const labels = await LabelModel.findAll({
        where: {},
        include: {
          model: TaskModel,
          through: { where: {taskId}, attributes: [] },
          required: true
        },
        attributes: ["id", "label"]
      })
      const output = labels.map(o => o.toJSON())
      return output
    }catch(err){
      return []
    }
  }
}
