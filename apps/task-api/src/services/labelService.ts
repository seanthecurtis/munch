import { LabelModel } from "../models/labels"

export class LabelService {
  labelUpsertMany = async (labelArray: LabelModel[]): Promise<LabelModel[]> => {
    try {
      const validLabels = labelArray.filter(item => item.label !== null).map(item => ({ ...item }))
      console.log(validLabels)
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

  labelIdByLabels = async (labelArray: string[]): Promise<LabelModel[]> => {
    try{
      return await LabelModel.findAll({where: {label: labelArray}, attributes: ["id"]})
    }catch(err){
      return []
    }
  }
}
