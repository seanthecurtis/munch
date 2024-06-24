import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { AuthHandler } from "../../../src/handlers/authHandlers"
import { faker } from "@faker-js/faker"
import { AuthService } from "../../__mocks__/authService"
import { MockFastifyInstance } from "../../__mocks__/fastifyInstance"
import { User } from "../../../src/types/default"
import {describe, expect, test, beforeEach, jest, beforeAll} from "@jest/globals"
import { ErrorHandler } from "../../__mocks__/ErrorHandler"
// import { AuthMiddleware } from "../../../src/helpers/auth"
import { MockAuthMiddleware } from "../../__mocks__/auth"

describe("Auth handler",() => {
  let authHandler: AuthHandler
  let authService: AuthService
  let errorHandler: ErrorHandler
  let authMiddleware: MockAuthMiddleware
  let reply: FastifyReply
  let mockFastify: MockFastifyInstance
  let server: FastifyInstance

  beforeAll(async()=>{
    server = fastify()
    await server.ready()
  })

  beforeEach(async()=>{
    authService = new AuthService()
    errorHandler = new ErrorHandler()
    authMiddleware = new MockAuthMiddleware(server, errorHandler)
    authHandler = new AuthHandler(authService, authMiddleware, errorHandler)
    mockFastify = new MockFastifyInstance()
    reply = mockFastify.createMockedReply()
  })

  test("register handler success", async()=>{
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    jest.spyOn(authMiddleware, "authenticate").mockResolvedValueOnce()
    jest.spyOn(authService, "registerService").mockResolvedValueOnce({}as User)

    const request = {body} as FastifyRequest

    await authHandler.registerHandler(request, reply)

    expect(reply.send).toHaveBeenCalledWith({message: "User registered"})
    expect(reply.status).toHaveBeenCalledWith(201)
  })

  test("register handler fail", async() => {
    const body = {
      password: faker.internet.password()
    }

    jest.spyOn(authService, "registerService").mockResolvedValueOnce(null)

    const request = {body} as FastifyRequest

    await authHandler.registerHandler(request, reply)

    expect(reply.status).toHaveBeenCalledWith(400)
    expect(reply.send).toHaveBeenCalledWith({ message: "User registration failed" })
  })

  test("login handler success", async() => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const request = {body} as FastifyRequest

    jest.spyOn(authService, "loginService").mockResolvedValueOnce({id: faker.string.uuid()} as User)

    await authHandler.loginHandler(request, reply)

    jest.spyOn(authMiddleware, "jwtSign").mockResolvedValueOnce(faker.string.uuid())

    expect(reply.status).toHaveBeenCalledWith(200)

    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      access_token: expect.any(String)
    }))
  })

  test("login handler invalid credentials", async() => {
    const body = {
      password: faker.internet.password()
    }

    jest.spyOn(authService, "loginService").mockResolvedValueOnce(null)

    const request = {body} as FastifyRequest

    await authHandler.loginHandler(request, reply)

    expect(reply.status).toHaveBeenCalledWith(401)
    expect(reply.send).toHaveBeenCalledWith({ message: "Invalid login credentials" })
  })

  test("login handler fail to sign tokens", async() => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    jest.spyOn(authMiddleware, "jwtSign").mockResolvedValueOnce(null)

    const request = {body} as FastifyRequest

    await authHandler.loginHandler(request, reply)

    expect(reply.status).toHaveBeenCalledWith(500)
    expect(reply.send).toHaveBeenCalledWith({ message: "Failed to generate access_token" })
  })

})