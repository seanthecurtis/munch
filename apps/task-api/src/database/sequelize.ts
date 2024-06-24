import { Sequelize } from "sequelize-typescript"
import { UserModel } from "../models/user"
import { db } from "../helpers/config"
import { TaskModel } from "../models/task"
import { TaskLabelModel } from "../models/taskLabels"
import { LabelModel } from "../models/labels"

const sequelize = new Sequelize({
  ...db,
  models: [UserModel, TaskModel, TaskLabelModel, LabelModel],
})


export default sequelize