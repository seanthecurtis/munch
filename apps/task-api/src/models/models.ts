/**
 * Import dependencies
 */
import { Sequelize } from "sequelize"

// Import custom models
import { initUserModel } from "./userModel"
import { initTaskModel } from "./taskModel"

/**
 * Initializes the models in the Sequelize instance.
 *
 * @param {Sequelize} sequelize - The Sequelize instance to initialize models in.
 */
function initModels(sequelize: Sequelize) {
  // Initialize user model
  initUserModel(sequelize)

  // Initialize task model
  initTaskModel(sequelize)
}

/**
 * Synchronizes the models with the database.
 *
 * @param {Sequelize} sequelize - The Sequelize instance to synchronize models with.
 * @returns {Promise<void>} A promise that resolves when synchronization is complete.
 */
export async function syncModels(sequelize: Sequelize): Promise<void> {
  // Initialize models
  initModels(sequelize)

  // Synchronize models with database (alter existing tables)
  await sequelize.sync({ alter: true })
}
