import { LabelModel } from "../models/labels"

// Class to manage all label related database interaction
export class LabelService {
  // Insert labels, uniqueness on label column
  labelUpsertMany = async (labelArray: LabelModel[]): Promise<LabelModel[]> => {
    try {
      const validLabels = labelArray.filter(item => item.label !== null).map(item => ({ ...item }))
      if(validLabels.length == 0){
        return []
      }
      return await LabelModel.bulkCreate(validLabels as LabelModel[], {ignoreDuplicates: true, returning: ["id"]})
      // const labels = await LabelModel.bulkCreate(labelArray, {ignoreDuplicates: true, returning: ["id"]})
      // return labels as Label[]
    } catch (err) {
      return []
    }
  }

  // Fetch a list of labels with a list of label names as input
  // See taskLabelAddHandler in TaskHandler to understand why this method exists
  labelIdByLabels = async (labelArray: string[]): Promise<LabelModel[]> => {
    try{
      return await LabelModel.findAll({where: {label: labelArray}, attributes: ["id"]})
    }catch(err){
      return []
    }
  }
}
