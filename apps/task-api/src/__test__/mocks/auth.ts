import { FastifyRequest } from "fastify"

export const mockAuthenticate = async (request: FastifyRequest) => {
  request.user = {id: 1, email: "someemail@somedomain.com"}
}
