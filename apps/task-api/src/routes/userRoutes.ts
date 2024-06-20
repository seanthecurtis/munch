import { FastifyInstance } from "fastify"
import { userGetOneHandler, userLoginHandler, userRegisterHandler } from "../controllers/userController"
import { userRegisterSchema } from "../schemas/userSchema"

async function userRoutes(server: FastifyInstance) {
  server.post("/register", {schema: userRegisterSchema}, userRegisterHandler)
  server.post("/login", {schema: userRegisterSchema}, userLoginHandler)
  server.get("/:id",{preHandler: [server.authenticate],}, userGetOneHandler)
}

export default userRoutes