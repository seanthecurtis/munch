export const userRegisterSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      status: { type: "string", default: "active" }
    }
  }
}
