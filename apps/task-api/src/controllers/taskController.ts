import { FastifyReply, FastifyRequest } from "fastify"
import { TaskService } from "../services/taskService"
import { TaskInput } from "../models/taskModel"

export async function taskCreateHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const taskService = new TaskService()
    const taskData = Object.assign({userId: request.user.id}, request.body) as TaskInput

    const task = await taskService.taskCreate(taskData as TaskInput)
    if(task){
      return reply.status(201).send({message: "Task successfully created", id: task.id})
    }
  }catch(err){
    console.log(err)
    return reply.status(400).send({message: "Failed to create task"})
  }
}

export async function taskUpdateHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const taskService = new TaskService()
    const taskData = request.body as TaskInput

    const user = await taskService.taskUpdate(taskData as TaskInput)
    if(user){
      return reply.status(201).send({message: "Registration successful"})
    }
  }catch(err){
    console.log(err)
    return reply.status(400).send({message: "Failed to register user"})
  }
}
