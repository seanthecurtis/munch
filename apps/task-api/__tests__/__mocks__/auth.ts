import { faker } from "@faker-js/faker"
import { AuthMiddleware } from "../../src/helpers/auth"

export class MockAuthMiddleware extends AuthMiddleware{
  authenticate = async (): Promise<void> => {}
  jwtSign = async (): Promise<string|null> => {return faker.string.uuid()}
}