import { FastifyReply, FastifyRequest } from "fastify"
import { checkHealth } from "../services/healthCheckService"

export async function healthCheckHandler(request: FastifyRequest, reply: FastifyReply) {
  try{
    const state = await checkHealth()
    if(state){
      return reply.status(200).send("OK")
    }
    return reply.status(500).send("Not OK")
  }catch(err){
    return reply.status(500).send("Not OK")
  }
}