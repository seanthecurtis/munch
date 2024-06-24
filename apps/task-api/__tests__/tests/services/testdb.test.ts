import { UserModel } from "../../../src/models/user"
import { Label, User } from "../../../src/types/default"
import sequelize from "../../database/sequelize"
import { AuthService } from "../../../src/services/authService"
import { TaskService } from "../../../src/services/taskService"
import { LabelService } from "../../../src/services/labelService"
import { Task } from "../../../src/types/default"
import { describe, expect, test, beforeAll, afterAll } from "@jest/globals"
import { faker } from "@faker-js/faker"
import { LabelModel } from "../../../src/models/labels"

describe("Service tests using testdb", () => {
  let authService: AuthService
  let taskService: TaskService
  let labelService: LabelService
  let registeredUser: User
  let registeredUserId: string | undefined
  let createdTaskId: string | undefined

  beforeAll(async () => {
    await sequelize.sync({ alter: true })
    authService = new AuthService()
    taskService = new TaskService()
    labelService = new LabelService()
  })

  afterAll(async () => {
    // TODO delete data afetr test is done
    // await TaskModel.destroy({truncate: true})
    // await UserModel.destroy({truncate: true})
    await sequelize.close()
  })

  test("Register and login", async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    } as User

    // Register the user
    const registerRes = await authService.registerService(userData)
    expect(registerRes).toBeTruthy()

    // Retrieve the registered user's details
    registeredUser = await UserModel.findOne({ where: { email: userData.email } }) as User
    registeredUserId = registeredUser.id

    // Attempt login
    const loginRes = await authService.loginService({
      email: userData.email,
      password: userData.password,
    })

    expect(loginRes).toBeTruthy()
  })

  test("Create a task successful", async () => {
    const taskData = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      priority: "medium",
      status: "open",
      dueDate: new Date(faker.date.future()).toISOString(),
      userId: registeredUserId,
    } as Task

    const createdTask = await taskService.taskCreateService(taskData) as Task
    createdTaskId = createdTask.id
    expect(createdTask).toBeTruthy()
  })

  test("Register and login failure: unique email", async () => {
    const userData = {
      email: registeredUser.email,
      password: faker.internet.password(),
    } as User

    // Attempt login with unregistered email
    await expect(authService.registerService(userData)).resolves.toBeFalsy()
  })

  test("Create a task failur: userId foreign key constraint", async () => {
    const taskData = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      priority: "low",
      status: "open",
      dueDate: new Date(faker.date.future()).toISOString(),
      userId: faker.string.uuid(),
    } as Task

    await expect(taskService.taskCreateService(taskData)).resolves.toBeFalsy()
  })

  test("Create a tag", async()=>{
    const labelArray = [{label: "tag1"}, {label: "Tag1"}, {label: "Tag2"}] as LabelModel[]

    const labels = await labelService.labelUpsertMany(labelArray) as Label[]

    expect(labels).toBeTruthy()
  })

  test("Assign a tag to the task",async()=>{
    console.log(createdTaskId)
  })
})
