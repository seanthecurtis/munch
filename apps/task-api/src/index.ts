// Import dependencies
import dotenv from "dotenv"

// Import custom
import buildServer from "./server"
import { EnvVariables } from "./types/default"

dotenv.config()
// Fetch env vars
const env: EnvVariables = {
  API_PORT: process.env.API_PORT as string,
  API_HOST: process.env.API_HOST as string,
  ENABLE_LOGGING: process.env.ENABLE_LOGGING as string
}

// Create fastify instance
const fastify = buildServer(env.ENABLE_LOGGING === "true")

async function main() {
  try {
    // Start server instance
    await fastify.listen({ port: parseInt(env.API_PORT), host: env.API_HOST })
    console.log(`Server listening: http://127.0.0.1/${env.API_PORT}`)
  } catch(err) {
    console.log(err)
    process.exit(0)
  }
}

// Start the server
main()