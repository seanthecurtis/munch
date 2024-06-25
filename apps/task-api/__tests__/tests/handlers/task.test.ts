import {describe, expect, it, beforeEach, jest, beforeAll} from "@jest/globals"
import { faker } from "@faker-js/faker"
import fastify, { FastifyInstance } from "fastify"
import { TaskHandler } from "../../../src/handlers/taskHandlers"
import { ErrorHandlerMock, MockFastifyInstance, MockFastifyReply, MockFastifyRequest } from "../../__mocks__/helpers"
import { LabelServiceMock } from "../../__mocks__/services"
import { TaskService } from "../../../src/services/taskService"
import { Label, Task } from "../../../src/types/default"
import { LabelService } from "../../../src/services/labelService"

describe("Task handler tests",()=>{
  let mockFastify: MockFastifyInstance
  let reply: MockFastifyReply
  let server: FastifyInstance
  let errorHandlerMock: ErrorHandlerMock
  let taskHandler: TaskHandler
  let taskServiceMock: TaskService
  let request: MockFastifyRequest
  let labelServiceMock: LabelService

  beforeAll(async ()=>{
    server = fastify()
    await server.ready()
  })
  beforeEach(()=>{
    mockFastify = new MockFastifyInstance()
    reply = mockFastify.createMockedReply()
    errorHandlerMock = new ErrorHandlerMock()
    taskServiceMock = new TaskService()
    labelServiceMock = LabelServiceMock
    taskHandler = new TaskHandler(taskServiceMock,errorHandlerMock)
  })

  it("should create a task", async()=>{
    const taskId = faker.string.uuid()
    const body = {
      title: faker.company.catchPhrase(),
      dueDate: faker.date.future(),
    }
    const user = {id: faker.string.uuid()}
    request = {body, user} as MockFastifyRequest

    jest.spyOn(taskServiceMock, "taskCreateService").mockResolvedValueOnce({id: taskId}as Task)

    await taskHandler.taskCreateHandler(request, reply)

    expect(reply.send).toHaveBeenCalledWith({message: "Task created", id: taskId})
    expect(reply.status).toHaveBeenCalledWith(201)
  })

  it("should list tasks for a user", async () => {
    const userId = faker.string.uuid()
    const queryParams = {
      status: "",
      priorityOrder: "",
      dueDateOrder: "",
    }
    request = { query: queryParams, user: { id: userId } } as MockFastifyRequest

    // Mock the taskListService method to resolve with a mock list of tasks
    const mockTasks: Task[] = [
      { id: faker.string.uuid(), userId: faker.string.uuid(), title: faker.company.catchPhrase(), dueDate: faker.date.future().toISOString() },
      { id: faker.string.uuid(), userId: faker.string.uuid(), title: faker.company.catchPhrase(), dueDate: faker.date.future().toISOString() },
    ]
    jest.spyOn(taskServiceMock, "taskListService").mockResolvedValueOnce(mockTasks)

    await taskHandler.taskListHandler(request, reply)

    expect(reply.send).toHaveBeenCalledWith({ tasks: mockTasks })
    expect(reply.status).toHaveBeenCalledWith(200)
  })

  it("should get a task by ID and attach labels", async () => {
    const userId = faker.string.uuid()
    const taskId = faker.string.uuid()
    const labels: Label[] = [
      { id: faker.string.uuid(), label: faker.lorem.word() },
      { id: faker.string.uuid(), label: faker.lorem.word() },
    ]

    request = { params: { id: taskId }, user: { id: userId } } as MockFastifyRequest

    // Mock taskService to return a task
    const mockTask: Task = {
      id: taskId, title: faker.company.catchPhrase(), userId: userId, dueDate: ""
    }
    jest.spyOn(taskServiceMock, "taskGetOneService").mockResolvedValueOnce(mockTask)

    // Mock labelService to return labels
    jest.spyOn(labelServiceMock, "labelsByTask").mockResolvedValueOnce(labels)

    await taskHandler.taskGetOneHandler(request, reply)

    // Assertions
    expect(reply.send).toHaveBeenCalled()
    expect(reply.status).toHaveBeenCalledWith(200)
  })
})