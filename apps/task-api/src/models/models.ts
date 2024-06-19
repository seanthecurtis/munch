import { Sequelize } from "sequelize"
import { initUserModel } from "./userModel"

function initModels(sequelize: Sequelize) {
  initUserModel(sequelize)
}

export async function syncModels(sequelize: Sequelize) {
  initModels(sequelize)
  await sequelize.sync({ alter: true })
}