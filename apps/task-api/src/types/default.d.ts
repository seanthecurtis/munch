import { JWT } from "@fastify/jwt"

// Type definition for environment variables
export type EnvVariables = {
  API_PORT: string;                 // Port number for the API server
  API_HOST: string;                 // Host address for the API server
  ENABLE_LOGGING: boolean;          // Flag to enable/disable logging
  MYSQL_DATABASE: string;           // Name of the MySQL database
  MYSQL_ROOT_PASSWORD: string;      // Password for MySQL root user
  MYSQL_PORT: string;               // Port number for MySQL connection
  MYSQL_ROOT_USER: string;          // Username for MySQL root user
  JWT_TOKEN: string;                // JWT secret token for authentication
  COOKIE_SECRET: string;            // Secret for encrypting cookies
  API_KEY: string;                  // API key for authenticating API requests
  MYSQL_HOST: string;               // Host address for MySQL database
  API_URL: string;                  // API url
};

// Extend the Fastify interfaces and modules with TypeScript declarations
declare module "fastify" {
  // Extend FastifyRequest interface to include 'jwt' property
  interface FastifyRequest {
    jwt: JWT;                       // JWT instance for handling JWT operations
  }

  // Extend FastifyInstance interface with 'authenticate' method
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  // Define additional properties for GetParams interface
  interface GetParams {
    id: string;                     // ID parameter expected in GET requests
  }
}

// Extend FastifyJWT interface from '@fastify/jwt' module with 'user' property
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;              // UserPayload type for JWT user information
  }
}

// Type definition for authentication function used in server setup
export type AuthFunction = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
