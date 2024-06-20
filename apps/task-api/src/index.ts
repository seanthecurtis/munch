// Import dependencies
import dotenv from "dotenv"

// Import custom modules and types
import buildServer from "./server"
import { EnvVariables } from "./types/default"
import initDatabase from "./database/sequelize"
import { syncModels } from "./models/models"
import { authenticate } from "./middleware/auth"
import configureSwagger from "./middleware/swagger"

// Load environment variables from .env file
dotenv.config()

// Define environment variables
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
  API_KEY: process.env.API_KEY as string,
  MYSQL_HOST: process.env.MYSQL_HOST as string,
  API_URL: process.env.API_URL as string
}

// Create Fastify server instance
const fastify = buildServer(env, authenticate)

// Initialize database connection
const db = initDatabase(env)

/**
 * Main function to start the Fastify server and connect to the database.
 */
async function main() {
  try {
    // Authenticate and sync database models
    await db.authenticate()
    await syncModels(db)
    console.log("Database connection established")

    configureSwagger(fastify, env)

    // Start Fastify server
    await fastify.listen({ port: Number(env.API_PORT), host: env.API_HOST })
    console.log(`Server listening: http://${env.API_HOST}:${env.API_PORT}`)
  } catch (err) {
    console.error("Server startup error\n", err)
    process.exit(1) // Exit with error
  }
}

// Listens for termination signals to properly close the Fastify server
const listeners = ["SIGINT", "SIGTERM"]
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close()
    console.log("Server closed")
    process.exit(0)
  })
})

// Start the server
main()
