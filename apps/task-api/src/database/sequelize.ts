import { Sequelize } from "sequelize"
import { EnvVariables } from "../types/default"

function initDatabase(config: EnvVariables){
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
