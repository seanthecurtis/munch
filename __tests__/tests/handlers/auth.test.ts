import fastify, { FastifyInstance, FastifyRequest } from "fastify"
import { AuthHandler } from "../../../src/handlers/authHandlers"
import { faker } from "@faker-js/faker"
import { User } from "../../../src/types/default"
import {describe, expect, test, beforeEach, jest, beforeAll} from "@jest/globals"
import { AuthMiddlewareMock, ErrorHandlerMock, MockFastifyInstance, MockFastifyReply } from "../../__mocks__/helpers"
import { AuthService } from "../../../src/services/authService"

describe("Auth handler tests",() => {
  let errorHandlerMock: ErrorHandlerMock
  let mockFastify: MockFastifyInstance
  let authServiceMock: AuthService
  let authMiddlewareMock: AuthMiddlewareMock
  let authHandler: AuthHandler
  let reply: MockFastifyReply
  let server: FastifyInstance


  beforeAll(async()=>{
    server = fastify()
    await server.ready()
  })

  beforeEach(async()=>{
    mockFastify = new MockFastifyInstance()
    errorHandlerMock = new ErrorHandlerMock()
    authServiceMock = new AuthService()
    authMiddlewareMock = new AuthMiddlewareMock(server, errorHandlerMock)
    reply = mockFastify.createMockedReply()
    authHandler = new AuthHandler(authServiceMock, authMiddlewareMock, errorHandlerMock)
  })

  test("should register a user", async()=>{
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    jest.spyOn(authMiddlewareMock, "authenticate").mockResolvedValueOnce()
    jest.spyOn(authServiceMock, "registerService").mockResolvedValueOnce({}as User)

    const request = {body} as FastifyRequest

    await authHandler.registerHandler(request, reply)

    expect(reply.send).toHaveBeenCalledWith({message: "User registered"})
    expect(reply.status).toHaveBeenCalledWith(201)
  })

  test("should fail to register a user", async() => {
    const body = {
      password: faker.internet.password()
    }

    jest.spyOn(authServiceMock, "registerService").mockResolvedValueOnce(null)

    const request = {body} as FastifyRequest

    await authHandler.registerHandler(request, reply)

    expect(reply.status).toHaveBeenCalledWith(400)
    expect(reply.send).toHaveBeenCalledWith({ message: "User registration failed" })
  })

  test("should login", async() => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const request = {body} as FastifyRequest

    jest.spyOn(authServiceMock, "loginService").mockResolvedValueOnce({id: faker.string.uuid()} as User)

    await authHandler.loginHandler(request, reply)

    jest.spyOn(authMiddlewareMock, "jwtSign").mockResolvedValueOnce(faker.string.uuid())

    expect(reply.status).toHaveBeenCalledWith(200)

    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      access_token: expect.any(String)
    }))
  })

  test("should fail to login when no email", async() => {
    const body = {
      password: faker.internet.password()
    }

    jest.spyOn(authServiceMock, "loginService").mockResolvedValueOnce(null)

    const request = {body} as FastifyRequest

    await authHandler.loginHandler(request, reply)

    expect(reply.status).toHaveBeenCalledWith(401)
    expect(reply.send).toHaveBeenCalledWith({ message: "Invalid login credentials" })
  })

  test("should fail to generate access tokens", async() => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    jest.spyOn(authServiceMock, "loginService").mockResolvedValueOnce({} as User)
    jest.spyOn(authMiddlewareMock, "jwtSign").mockResolvedValueOnce(null)

    const request = {body} as FastifyRequest

    await authHandler.loginHandler(request, reply)

    expect(reply.status).toHaveBeenCalledWith(500)
    expect(reply.send).toHaveBeenCalledWith({ message: "Failed to generate access_token" })
  })

})