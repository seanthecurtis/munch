import { Sequelize } from "sequelize"
import { EnvVariables } from "../types/default"

/**
 * Initialize Sequelize database connection based on provided configuration.
 *
 * @param {EnvVariables} config - Configuration object containing database connection details.
 * @returns {Sequelize} Initialized Sequelize instance.
 */
function initDatabase(config: EnvVariables): Sequelize {
  const sequelize = new Sequelize({
    database: config.MYSQL_DATABASE,
    dialect: "mysql",
    host: config.MYSQL_HOST,
    username: config.MYSQL_ROOT_USER,
    password: config.MYSQL_ROOT_PASSWORD,
    port: Number(config.MYSQL_PORT),
    logging: config.ENABLE_LOGGING
  })
  return sequelize
}

export default initDatabase
