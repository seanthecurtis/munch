import { BelongsToMany, Table, Column, Model, DataType, PrimaryKey, Default, Unique } from "sequelize-typescript"
import { TaskModel } from "./task"
import { TaskLabelModel } from "./taskLabels"

@Table({
  tableName: "labels",
  timestamps: true,
})
export class LabelModel extends Model<LabelModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
    id!: string

  @Unique({name: "u_label", msg: "Label must be unique"})
  @Column(DataType.STRING)
    label!: string
  
  @BelongsToMany(() => TaskModel, () => TaskLabelModel)
    tasks!: TaskModel[]
}
