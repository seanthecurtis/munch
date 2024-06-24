import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript"
import { TaskModel } from "./task"
import { LabelModel } from "./labels"

@Table({
  tableName: "task_labels",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["taskId", "labelId"],
      name: "u_task_label"
    },
  ],
})
export class TaskLabelModel extends Model<TaskLabelModel> {
  @ForeignKey(() => TaskModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
    taskId!: string

  @ForeignKey(() => LabelModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
    labelId!: string
}
