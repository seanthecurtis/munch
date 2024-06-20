// Import dependencies
import dotenv from "dotenv"

// Import custom
import buildServer from "./server"
import { EnvVariables } from "./types/default"
import initDatabase from "./database/sequelize"
import { syncModels } from "./models/models"

dotenv.config()
// Fetch env vars
const env: EnvVariables = {
  API_PORT: process.env.API_PORT as string,
  API_HOST: process.env.API_HOST as string,
  ENABLE_LOGGING: process.env.ENABLE_LOGGING === "true" || true as boolean,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE as string,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD as string,
  MYSQL_PORT: process.env.MYSQL_PORT as string,
  MYSQL_ROOT_USER: process.env.MYSQL_ROOT_USER as string,
  JWT_TOKEN: process.env.JWT_TOKEN as string,
  COOKIE_SECRET: process.env.COOKIE_SECRET as string,
  API_KEY: process.env.API_KEY as string
}

// Create fastify instance
const fastify = buildServer(env)
const db = initDatabase(env)

async function main() {
  try {
    // Connect the db
    await db.authenticate()
    await syncModels(db)
    console.log("Database connection established")
    // Start server instance
    await fastify.listen({ port: Number(env.API_PORT), host: env.API_HOST })
    console.log(`Server listening: http://127.0.0.1/${env.API_PORT}`)
  } catch(err) {
    console.error("Server startup error\n",err)
    process.exit(0)
  }
}

const listeners = ["SIGINT", "SIGTERM"]
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close()
    process.exit(0)
  })
})

// Start the server
main()