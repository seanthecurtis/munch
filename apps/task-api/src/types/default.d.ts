import { JWT } from "@fastify/jwt"

// Type for env variables
export type EnvVariables = {
  API_PORT: string
  API_HOST: string
  ENABLE_LOGGING: boolean
  MYSQL_DATABASE: string
  MYSQL_ROOT_PASSWORD: string
  MYSQL_PORT: string
  MYSQL_ROOT_USER: string
  JWT_TOKEN: string
  COOKIE_SECRET: string
  API_KEY: string
};

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
  interface GetParams {
    id: string;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload
  }
}