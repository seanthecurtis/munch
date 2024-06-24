import * as dotenv from "dotenv"
import { Options } from "sequelize"

dotenv.config()

const {
  API_PORT,
  API_HOST,
  API_URL,
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
  MYSQL_HOST,
  MYSQL_ROOT_USER,
  ENABLE_LOGGING,
  JWT_TOKEN,
  COOKIE_SECRET,
  API_KEY,
} = process.env

export const db: Options = {
  username: MYSQL_ROOT_USER,
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE,
  host: MYSQL_HOST,
  port: parseInt(MYSQL_PORT || "3306", 10),
  dialect: "mysql",
  logging: ENABLE_LOGGING === "true",
}

export const serverConfig = {
  port: parseInt(API_PORT || "3001", 10),
  host: API_HOST || "0.0.0.0",
  url: API_URL || "http://127.0.0.1:3001",
}

export const authConfig = {
  jwtToken: JWT_TOKEN,
  cookieSecret: COOKIE_SECRET,
  apiKey: API_KEY,
}
