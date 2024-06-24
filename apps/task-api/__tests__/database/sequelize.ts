import { Sequelize } from "sequelize-typescript"
import { UserModel } from "../../src/models/user"
import { db } from "../helpers/config"
import { TaskModel } from "../../src/models/task"
import { LabelModel } from "../../src/models/labels"
import { TaskLabelModel } from "../../src/models/taskLabels"

const sequelize = new Sequelize({
  ...db,
  models: [UserModel, TaskModel, LabelModel, TaskLabelModel],
})

export default sequelize