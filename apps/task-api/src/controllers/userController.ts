import { FastifyReply, FastifyRequest, GetParams } from "fastify"
import { UserService } from "../services/userService"
import { UserInput } from "../models/userModel"

export async function userRegisterHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const userService = new UserService()
    const { email, password, status } = request.body as UserInput

    const user = await userService.userRegister({email, password, status})
    if(user){
      return reply.status(201).send({message: "Registration successful"})
    }
  }catch(err){
    console.log(err)
    return reply.status(400).send({message: "Failed to register user"})
  }
}

export async function userListHandler(_: FastifyRequest, reply: FastifyReply) {
  try{
    const userService = new UserService()

    const users = await userService.userList()
    return reply.status(200).send({users})
  }catch(err){
    console.log(err)
    return reply.status(400).send({message: "Failed to register user"})
  }
}

export async function userLoginHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const userService = new UserService()
    const { email, password } = request.body as UserInput

    const {token} = await userService.userLogin({email, password}, request.jwt)
    if(token && token.length > 0){
      // Add cookies
      reply.setCookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "strict", // CSRF protection
      })
      return reply.status(200).send({message: "Login successful", token})
    }
    return reply.status(400).send({message: "Failed to login user"})
  }catch(err){
    console.log(err)
    return reply.status(400).send({message: "Failed to login user"})
  }
}

export async function userGetOneHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const userService = new UserService()
    const { id } = request.params as GetParams

    const user = await userService.userGetOneById(id)
    if(user){
      return reply.status(200).send({message: "User found", user})
    }
    return reply.status(400).send({message: "User not found"})
  }catch(err){
    console.log(err)
    return reply.status(400).send({message: "User not found"})
  }
}