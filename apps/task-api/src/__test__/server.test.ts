import { test }  from "tap"
import dotenv from "dotenv"

import buildServer from "../server"
import { EnvVariables } from "../types/default"

dotenv.config({ path: './src/__test__/.env' })

test("healthcheck", async (t) => {
  const env: EnvVariables = {
    API_PORT: process.env.API_PORT as string,
    API_HOST: process.env.API_HOST as string,
    ENABLE_LOGGING: process.env.ENABLE_LOGGING as string
  }
  console.log(env)
  // Create fastify instance
  const fastify = buildServer(env.ENABLE_LOGGING === "true")
  t.teardown(()=>{
    fastify.close()
  })
})