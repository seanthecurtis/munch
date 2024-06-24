import { faker } from "@faker-js/faker"
import { User } from "../../src/types/default"

export class AuthService{
  registerService = async (): Promise<User | null> => {
    return {} as User
  }
  
  loginService = async (): Promise<User | null> => {
    return {id: faker.string.uuid()} as User
  }
}