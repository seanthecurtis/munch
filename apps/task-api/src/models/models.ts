import { Sequelize } from "sequelize"
import { initUserModel } from "./userModel"
import { initTaskModel } from "./taskModel"

function initModels(sequelize: Sequelize) {
  initUserModel(sequelize)
  initTaskModel(sequelize)
}

export async function syncModels(sequelize: Sequelize) {
  initModels(sequelize)
  await sequelize.sync({ alter: true })
}