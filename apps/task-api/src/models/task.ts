import { BelongsToMany, Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript"
import { UserModel } from "./user"
import { LabelModel } from "./labels"
import { TaskLabelModel } from "./taskLabels"

@Table({
  tableName: "tasks",
  timestamps: true,
})
export class TaskModel extends Model<TaskModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
    id!: string

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
    userId!: string

  @Column(DataType.STRING)
    title!: string

  @Column(DataType.STRING)
    description!: string

  @AllowNull(false)
  @Default("low")
  @Column(DataType.STRING)
    priority!: string

  @AllowNull(false)
  @Default("open")
  @Column(DataType.STRING)
    status!: string

  @Column(DataType.STRING)
    dueDate!: string
  
  @BelongsTo(() => UserModel, { foreignKey: "userId", targetKey: "id" })
    user!: UserModel

  @BelongsToMany(() => LabelModel, () => TaskLabelModel)
    labels!: LabelModel[]
}
