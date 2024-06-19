import { FastifyReply, FastifyRequest } from "fastify"
import { UserRegisterService } from "../services/userService"
import { UserRegisterRequest } from "../types/schemas"

export async function userRegisterHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const userRegisterService = new UserRegisterService()
    const { email, password, status } = request.body as UserRegisterRequest

    const user = await userRegisterService.userRegister({email, password, status})
    if(user){
      return reply.status(201).send({message: "Registration successful"})
    }
  }catch(err){
    return reply.status(400).send({message: "Failed to register user"})
  }
}