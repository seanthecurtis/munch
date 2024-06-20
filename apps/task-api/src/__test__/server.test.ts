import { test }  from "tap"
import dotenv from "dotenv"

import buildServer from "../server"
import { EnvVariables } from "../types/default"

dotenv.config({ path: "./src/__test__/.env" })

test("healthcheck", async (t) => {
  const env: EnvVariables = {
    API_PORT: process.env.API_PORT as string,
    API_HOST: process.env.API_HOST as string,
    ENABLE_LOGGING: process.env.ENABLE_LOGGING === "true" || false as boolean,
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
  t.teardown(()=>{
    fastify.close()
  })
})