// Import dependencies
import { test }  from "tap"
import dotenv from "dotenv"
import { faker } from "@faker-js/faker"
import { ImportMock } from "ts-mock-imports"

// Import custom
import buildServer from "../server"
import { EnvVariables } from "../types/default"
import initDatabase from "../database/sequelize"
import { syncModels } from "../models/models"
import * as userService from "../services/userService"
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

test("user register and login with database connection", async (t) => {
  try {
    // Create fastify instance
    const fastify = buildServer(env, authenticate)
    t.teardown(async ()=>{
      await fastify.close()
    })

    const db = initDatabase(env)
    db.authenticate()
    await syncModels(db)

    const password = faker.internet.password()
    const email = faker.internet.email()

    const response = await fastify.inject({
      method: "POST",
      url: "api/users/register",
      payload: {
        email,
        password
      },
      headers: {
        "x-api-key": env.API_KEY
      }
    })

    t.equal(response.statusCode, 201)
    const jsonResponse = response.json()
    t.equal(jsonResponse.message, "Registration successful")

    const responseLogin = await fastify.inject({
      method: "POST",
      url: "api/users/login",
      payload: {
        email,
        password
      },
      headers: {
        "x-api-key": env.API_KEY
      }
    })

    t.equal(responseLogin.statusCode, 200)
    const jsonResponseLogin = responseLogin.json()
    t.equal(jsonResponseLogin.message, "Login successful")
  } catch(err){
    t.fail(err as string)
    console.log(err)
  } finally{
    t.end()
  }
})

test("user register with mock data", async (t) => {
  try{
    // Create fastify instance
    const fastify = buildServer(env, authenticate)
    t.teardown(async ()=>{
      await fastify.close()
    })

    const email = faker.internet.email()
    const password = faker.internet.password()

    const stub = ImportMock.mockClass(userService,"UserService")
    stub.mock("userRegister", {message: "Registration successful"})
    const response = await fastify.inject({
      method: "POST",
      url: "api/users/register",
      payload: {
        email,
        password
      },
      headers: {
        "x-api-key": env.API_KEY
      }
    })

    t.equal(response.statusCode, 201)
    const jsonResponse = response.json()
    t.equal(jsonResponse.message, "Registration successful")
    stub.restore()
  } catch(err){
    t.fail(err as string)
    console.log(err)
  } finally{
    t.end()
  }
})

test("user register fail with mock data: email required", async (t) => {
  try{
  // Create fastify instance
    const fastify = buildServer(env, authenticate)
    t.teardown(async ()=> {
      await fastify.close()
    })

    const password = faker.internet.password()

    const stub = ImportMock.mockClass(userService,"UserService")
    stub.mock("userRegister", {message: "Registration successful"})
    const response = await fastify.inject({
      method: "POST",
      url: "api/users/register",
      payload: {
        password
      },
      headers: {
        "x-api-key": env.API_KEY
      }
    })

    t.equal(response.statusCode, 400)
    const jsonResponse = response.json()
    t.equal(jsonResponse.message, "body Email is required")
    stub.restore()
  } catch(err){
    t.fail(err as string)
    console.log(err)
  } finally{
    t.end()
  }
})
