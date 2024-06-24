/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyInstance } from "fastify"
import { jest } from "@jest/globals"

export interface MockFastifyReply extends FastifyReply {
  send: jest.Mock<any>,
  status: jest.Mock<any>,
  jwtSign: jest.Mock<any>,
  setCookie: jest.Mock<any>
}

export interface MockFastifyInstance extends FastifyInstance{}

export interface IMockAuthMiddleware {
  authenticate: () => Promise<void>;
  jwtSign: () => Promise<string | null>;
}

/* eslint-enable @typescript-eslint/no-explicit-any */