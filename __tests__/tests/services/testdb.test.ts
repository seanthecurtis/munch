import { UserModel } from "../../../src/models/user"
import { Label, TaskQueryParams, User, UserQueryParams } from "../../../src/types/default"
import sequelize from "../../database/sequelize"
import { AuthService } from "../../../src/services/authService"
import { TaskService } from "../../../src/services/taskService"
import { LabelService } from "../../../src/services/labelService"
import { Task } from "../../../src/types/default"
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals"
import { faker } from "@faker-js/faker"
import { LabelModel } from "../../../src/models/labels"
import { TaskModel } from "../../../src/models/task"
import { TaskLabelModel } from "../../../src/models/taskLabels"
import { UserService } from "../../../src/services/userService"
// import { TaskLabelService } from "../../../src/services/taskLabelService"

describe("Service tests using testdb", () => {
  let authService: AuthService
  let taskService: TaskService
  let labelService: LabelService
  let userService: UserService
  // let taskLabelService: TaskLabelService
  let user: User
  let userId: string
  let taskId: string
  let labels: Label[]
  const email = faker.internet.email()
  const password = faker.internet.password()

  beforeAll(async () => {
    await sequelize.sync({ alter: true })
    authService = new AuthService()
    taskService = new TaskService()
    labelService = new LabelService()
    userService = new UserService()
    // taskLabelService = new TaskLabelService()
  })

  afterAll(async () => {
    // Start a database transaction to properly close the connection
    const transaction = await sequelize.transaction()
    try {
      await TaskLabelModel.destroy({ where: {}, transaction })
      await LabelModel.destroy({ where: {}, transaction })
      await TaskModel.destroy({ where: {}, transaction })
      await UserModel.destroy({ where: {}, transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error("Error during cleanup:", error)
    } finally {
      await sequelize.close()
    }
  })
  // ==================== AUTH ====================================================
  it("should register a user", async () => {
    // Register the user
    const registerRes = await authService.registerService({
      email,
      password,
    })
    expect(registerRes).toBeTruthy()

    // Retrieve the registered user's details
    user = await UserModel.findOne({ where: { email } }) as User
    userId = user.id as string
  })

  it("should login the user", async()=>{
    // Attempt login
    const loginRes = await authService.loginService({
      email: email,
      password: password,
    })

    expect(loginRes).toBeTruthy()
  })

  it("should retrieve a list of users", async()=>{
    const users = await userService.userList({}) as User[]

    expect(users.length).toBeGreaterThan(0)
  })

  it("should retrieve a users details", async()=>{
    const users = await userService.userGetOneByID(userId) as User

    expect(users).toBeTruthy()
    expect(users.id).toBe(userId)
  })

  it("should return null for non-existent user", async () => {
    const nonExistentUserId = faker.string.uuid()
    const retrievedUser = await userService.userGetOneByID(nonExistentUserId)

    expect(retrievedUser).toBeNull()
  })

  it("should retrieve a list of users with filters", async () => {
    const filters: UserQueryParams = { email }
    const users = await userService.userList(filters) as User[]

    expect(users).toBeDefined()
    expect(users.length).toBeGreaterThan(0)
    expect(users[0].email).toBe(email)
  })

  it("should return an empty list for unmatched filters", async () => {
    const filters: UserQueryParams = { email: "nonexistent@example.com" }
    const users = await userService.userList(filters) as User[]

    expect(users).toBeDefined()
    expect(users.length).toBe(0)
  })

  // ==================== LABELS ====================================================

  it("should create labels", async()=>{
    const labelArray = [{label: faker.string.uuid()}, {label: faker.string.uuid()}, {label: faker.string.uuid()}] as LabelModel[]

    labels = await labelService.labelUpsertMany(labelArray) as Label[]

    expect(labels).toBeDefined()
    expect(labels.length).toBe(3)
  })

  it("should fetch labels", async()=>{
    const labelNames = labels.map(label => label.label)
    const labelIds = await labelService.labelIdByLabels(labelNames)

    expect(labelIds).toBeDefined()
    expect(labelIds.length).toBe(labelNames.length)
    labelIds.forEach((label) => {
      expect(label.id).toBeDefined()
    })
  })

  // ==================== Tasks ====================================================
  it("should create a task", async () => {
    const taskData = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      priority: "medium",
      status: "open",
      dueDate: new Date(faker.date.future()).toISOString(),
      userId: userId,
    } as Task

    const createdTask = await taskService.taskCreateService(taskData) as Task
    taskId = createdTask.id as string
    expect(createdTask).toBeTruthy()
  })

  it("should fail to login on unique email", async () => {
    const userData = {
      email: user.email,
      password: faker.internet.password(),
    } as User

    // Attempt login with unregistered email
    await expect(authService.registerService(userData)).resolves.toBeFalsy()
  })

  it("should create a task failure: userId foreign key constraint", async () => {
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

  it("should assign labels to the task",async()=>{
    // console.log(taskId)
  })

  it("should list tasks", async()=>{
    // taskListService
    const filters: TaskQueryParams = {
      status: "open",
      priorityOrder: "desc",
      dueDateOrder: "asc",
    }

    const tasks = await taskService.taskListService(userId, filters)
    expect(tasks).toBeDefined()
    expect(tasks.length).toBeGreaterThan(0)
  })

  it("should fetch a task", async()=>{
    // taskGetOneService
    const task = await taskService.taskGetOneService(userId, taskId)
    expect(task).toBeDefined()
    expect(task?.id).toEqual(taskId)
  })

  it("should update a task", async()=>{
    // taskUpdateService
    const updatedTaskData: Task = {
      id: taskId,
      title: "Updated Task Title",
      description: "Updated description",
      priority: "high",
      status: "in-progress",
      dueDate: new Date().toISOString(),
      userId: userId,
    }

    const affectedRows = await taskService.taskUpdateService(updatedTaskData, userId, taskId)
    expect(affectedRows).toBe(1)
  })

  // // ==================== Task and Labels ====================================================
  it("should assign labels to the task", async()=>{
    // const labelsInsert = []
    // taskLabelService.taskLabelUpsert(labelsInsert, )
  })
  
  // test("Fetch labels linked to task", async()=>{
  //   // labelsByTask
  // })

  it("should delete a task", async()=>{
    const deletedRows = await taskService.taskDeleteOneService(userId, taskId)
    expect(deletedRows).toBe(1)
  })
})
