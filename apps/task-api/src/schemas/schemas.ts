import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

// User schemas
const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  status: z.string().optional().default("active"),
})

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Task schemas
const taskCreateSchema = z.object({
  title: z.string().min(1),
  userId: z.number().optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional().default("low"),
  dueDate: z.string().regex(/^\d{4}-(0\d|1[0-2])-(0\d|1\d|2\d|3[01])$/),
  status: z.enum(["open", "in progress", "completed"]).optional().default("open")
})

const taskUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().regex(/^\d{4}-(0\d|1[0-2])-(0\d|1\d|2\d|3[01])$/),
  status: z.enum(["open", "in progress", "completed"]).optional(),
})

export const { schemas: Schemas, $ref } = buildJsonSchemas({
  taskCreateSchema,
  userRegisterSchema,
  userLoginSchema,
  taskUpdateSchema,
})