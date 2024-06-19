import { test }  from "tap"
import dotenv from "dotenv"
import { faker } from "@faker-js/faker"
import { ImportMock } from "ts-mock-imports"

import buildServer from "../server"
import { EnvVariables } from "../types/default"
import initDatabase from "../database/sequelize"
import { syncModels } from "../models/models"
import * as userService from "../services/userService"
import { UserRegisterService } from "../services/userService"

dotenv.config({ path: "./src/__test__/.env" })

const env: EnvVariables = {
  API_PORT: process.env.API_PORT as string,
  API_HOST: process.env.API_HOST as string,
  ENABLE_LOGGING: process.env.ENABLE_LOGGING as string,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE as string,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD as string,
  MYSQL_PORT: process.env.MYSQL_PORT as string,
  MYSQL_ROOT_USER: process.env.MYSQL_ROOT_USER as string
}

test("user register with database connection", async (t) => {
  // Create fastify instance
  const fastify = buildServer(env.ENABLE_LOGGING === "true")
  t.teardown(()=>{
    fastify.close()
  })

  const db = initDatabase(env)
  db.authenticate()
  await syncModels(db)

  const response = await fastify.inject({
    method: "POST",
    url: "api/users/register",
    payload: {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  })

  t.equal(response.statusCode, 201)
  const jsonResponse = response.json()
  t.equal(jsonResponse.message, "Registration successful")
})

test("user register with mock data", async (t) => {
  // Create fastify instance
  const fastify = buildServer(env.ENABLE_LOGGING === "true")
  t.teardown(()=>{
    fastify.close()
  })

  const email = faker.internet.email()
  const password = faker.internet.password()

  const stub = ImportMock.mockClass(userService,"UserRegisterService")
  stub.mock('userRegister', {message: "Registration successful"})
  const response = await fastify.inject({
    method: "POST",
    url: "api/users/register",
    payload: {
      email,
      password
    }
  })

  t.equal(response.statusCode, 201)
  const jsonResponse = response.json()
  t.equal(jsonResponse.message, "Registration successful")
  stub.restore();
})
