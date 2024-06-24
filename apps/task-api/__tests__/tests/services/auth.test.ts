import { UserModel } from "../../../src/models/user"
import { User } from "../../../src/types/default"
import { faker } from "@faker-js/faker"
import { AuthService } from "../../../src/services/authService"
import {describe, expect, test, beforeEach, jest, beforeAll} from "@jest/globals"

describe("Auth Services", () => {
  let authService: AuthService
  beforeAll(()=>{})
  beforeEach(() => {
    jest.clearAllMocks()
    authService = new AuthService()
  })

  test("user register: failure", async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password()
    } as User

    // Mock User.create to throw an error
    jest.spyOn(UserModel, "create").mockImplementationOnce(() => {
      throw new Error("Database error")
    })

    await expect(authService.registerService(userData)).resolves.toBeFalsy()
  })

  test("user login: success", async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const userData = {
      email,
      password
    } as User

    // Mock User.create to create a mock user
    jest.spyOn(UserModel, "findOne").mockResolvedValueOnce({id: faker.string.uuid(), password} as UserModel)

    const loginRes = await authService.loginService(userData)

    expect(loginRes).toBeTruthy()
  })
})
