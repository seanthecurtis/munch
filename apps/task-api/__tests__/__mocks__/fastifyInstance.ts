import { MockFastifyReply } from "./interfaces"
import { jest } from "@jest/globals"

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
