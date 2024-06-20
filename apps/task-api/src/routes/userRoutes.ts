import { FastifyInstance } from "fastify"
import { userGetOneHandler, userListHandler, userLoginHandler, userRegisterHandler } from "../controllers/userController"
import { userLoginSchema, userRegisterSchema } from "../schemas/schemas"

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/register",
    {schema: userRegisterSchema},
    userRegisterHandler
  )
  server.post(
    "/login", 
    {schema: userLoginSchema},
    userLoginHandler
  )
  server.get("/:id", { preHandler: [server.authenticate] }, userGetOneHandler)
  server.get("/", { preHandler: [server.authenticate] }, userListHandler)
}

export default userRoutes