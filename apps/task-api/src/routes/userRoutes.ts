import { FastifyInstance } from "fastify"
import { userRegisterHandler } from "../controllers/userController"

async function userRoutes(server: FastifyInstance) {
  server.post("/register", userRegisterHandler)
}

export default userRoutes