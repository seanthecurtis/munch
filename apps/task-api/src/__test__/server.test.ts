// Import dependencies
import { test }  from "tap"
import dotenv from "dotenv"

// Import custom
import buildServer from "../server"
import { EnvVariables } from "../types/default"
import { authenticate } from "../middleware/auth"

dotenv.config({ path: "./src/__test__/.env" })

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
  API_KEY: process.env.API_KEY as string,
  MYSQL_HOST: process.env.MYSQL_HOST as string,
  API_URL: process.env.API_URL as string
}

test("invalid api key", async (t) => {
  const fastify = buildServer(env, authenticate)
  t.teardown(()=>{
    fastify.close()
  })

  const response = await fastify.inject({
    method: "GET",
    url: "healthcheck"
  })

  t.equal(response.statusCode, 401)
  const jsonResponse = response.json()
  t.equal(jsonResponse.message, "Unauthorized")
})

test("healthcheck", async (t) => {

  // Create fastify instance
  const fastify = buildServer(env, authenticate)
  t.teardown(()=>{
    fastify.close()
  })

  const response = await fastify.inject({
    method: "GET",
    url: "healthcheck",
    headers: {
      "x-api-key": env.API_KEY
    }
  })

  t.equal(response.statusCode, 200)
  t.equal(response.body, "OK")

})