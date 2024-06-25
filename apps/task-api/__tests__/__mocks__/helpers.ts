import { faker } from "@faker-js/faker"
// import { mock } from "jest-mock-extended"
import { AuthMiddleware } from "../../src/helpers/auth"
import { ErrorHandler } from "../../src/helpers/errorHandler"
import { FastifyReply, FastifyRequest } from "fastify"
import { HttpError } from "../../src/types/interfaces"
import { jest } from "@jest/globals"
// import { AuthService } from "../../src/services/authService"
// import { TaskService } from "../../src/services/taskService"

// export const AuthMiddlewareMock = mock<AuthMiddleware>()
// export const AuthServiceMock = mock<AuthService>()
// export const TaskServiceMock = mock<TaskService>()
// export const FastifyMock: MockProxy<FastifyInstance> = mock<FastifyInstance>()
// export const FastifyReplyMock = mock<FastifyReply>()

export class AuthMiddlewareMock extends AuthMiddleware{
  authenticate = async (): Promise<void> => {}
  jwtSign = async (): Promise<string|null> => {
    return faker.string.uuid()
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MockFastifyReply extends FastifyReply {
  send: jest.Mock<any>,
  status: jest.Mock<any>,
  jwtSign: jest.Mock<any>,
  setCookie: jest.Mock<any>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface MockFastifyRequest extends FastifyRequest {
  user: {
    id: string;
  };
}

export class MockFastifyInstance {
  createMockedReply = (): MockFastifyReply => {
    return {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      jwtSign: jest.fn().mockReturnThis(),
      setCookie: jest.fn().mockReturnThis()
    } as MockFastifyReply
  }
}

export class ErrorHandlerMock extends ErrorHandler{
  httpErrorHandler = async (reply: FastifyReply, err: HttpError)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    // console.error(err)
    return reply.status(statusCode).send({message})
  }
}