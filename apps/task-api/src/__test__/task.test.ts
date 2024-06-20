import { test }  from "tap"
import dotenv from "dotenv"
import { faker } from "@faker-js/faker"
// import { ImportMock } from "ts-mock-imports"
import { format } from "date-fns"

import buildServer from "../server"
import { EnvVariables } from "../types/default"
import initDatabase from "../database/sequelize"
import { syncModels } from "../models/models"
import { mockAuthenticate } from "./mocks/auth"
// import * as taskService from "../services/taskService"

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
  MYSQL_HOST: process.env.MYSQL_HOST as string
}

test("task create and update with database connection", async (t) => {
  try {
    // Create fastify instance
    const fastify = buildServer(env, mockAuthenticate)
    t.teardown(async ()=>{
      await fastify.close()
    })

    const db = initDatabase(env)
    db.authenticate()
    await syncModels(db)

    const title = faker.lorem.text().slice(0, 100)
    const randomDate = faker.date.future()
    const dueDate = format(new Date(randomDate), "yyyy-MM-dd")

    const response = await fastify.inject({
      method: "POST",
      url: "api/tasks",
      payload: {
        title,
        dueDate
      },
      headers: {
        "x-api-key": env.API_KEY
      }
    })

    t.equal(response.statusCode, 201)
    const jsonResponse = response.json()
    t.equal(jsonResponse.message, "Task successfully created")

  } catch(err){
    t.fail(err as string)
    console.log(err)
  } finally{
    t.end()
  }
})

