// Schema for user registration
export const userRegisterSchema = {
  $id: "registerSchema",
  body: {
    additionalProperties: false,
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", errorMessage: "Invalid email format" },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 255,
        errorMessage: {
          minLength: "Password must be at least 8 characters long"
        }
      }
    },
    errorMessage: {
      required: {
        email: "Email is required",
        password: "Password is required"
      }
    }
  }
}

// Schema for user login
export const userLoginSchema = {
  $id: "loginSchema",
  body: {
    additionalProperties: false,
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", errorMessage: "Invalid email format" },
      password: {
        type: "string",
      }
    },
    errorMessage: {
      required: {
        email: "Email is required",
        password: "Password is required"
      }
    }
  }
}

// Schema for creating a task.
export const taskCreateSchema = {
  $id: "taskCreateSchema",
  body: {
    additionalProperties: false,
    type: "object",
    required: ["title", "dueDate"],
    properties: {
      title: {
        type: "string",
        maxLength: 100,
        minLength: 1,
        errorMessage: {
          minLength: "Title may not be empty.",
          maxLength: "Title exceeds 100 characters."
        }
      },
      userId: {
        type: "number"
      },
      description: {
        type: "string",
        minLength: 1,
        maxLength: 255,
        errorMessage: {
          minLength: "Description may not be empty.",
          maxLength: "Description exceeds 255 characters."
        }
      },
      dueDate: {
        type: "string"
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        errorMessage: {
          enum: "Priority options: low, medium, high."
        }
      },
      status: {
        type: "string",
        enum: ["open", "in progress", "completed"],
        errorMessage: {
          enum: "Status options: 'open', 'in progress', 'completed'."
        }
      },
    },
    errorMessage: {
      required: {
        title: "Title is required",
        dueDate: "A due date is required",
      }
    }
  }
}

// Schema for updating a task.
export const taskUpdateSchema = {
  $id: "taskUpdateSchema",
  body: {
    additionalProperties: false,
    type: "object",
    properties: {
      title: {
        type: "string",
        maxLength: 100,
        minLength: 1,
        errorMessage: {
          minLength: "Title may not be empty.",
          maxLength: "Title exceeds 100 characters."
        }
      },
      description: {
        type: "string",
        minLength: 1,
        maxLength: 255,
        errorMessage: {
          minLength: "Description may not be empty.",
          maxLength: "Description exceeds 255 characters."
        }
      },
      dueDate: {
        type: "string"
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        errorMessage: {
          enum: "Priority options: Low, Medium, High."
        }
      },
      status: {
        type: "string",
        enum: ["open", "in progress", "completed"],
        errorMessage: {
          enum: "Status options: 'open', 'in progress', 'completed'."
        }
      }
    }
  }
}

// Schema for assigning a user to a task.
export const taskAssignSchema = {
  $id: "taskAssignSchema",
  body: {
    required: ["userId"],
    type: "object",
    additionalProperties: false,
    properties: {
      userId: {
        type: "string"
      },
    }
  }
}

// Schema for assigning labels to a task.
export const taskTagSchema = {
  $id: "taskTagSchema",
  body: {
    additionalProperties: false,
    type: "array",
    items: {
      type: "string",
      minLength: 1,
      maxLength: 255, // limit each label name to 255 characters
      minItems: 1,
      maxItems: 100 // limit the api to batches of 100
    }
  }
}

// Schema for task status updates
export const taskStatusSchema = {
  $id: "taskStatusSchema",
  body: {
    required: ["status"],
    type: "object",
    additionalProperties: false,
    properties: {
      status: taskCreateSchema.body.properties.status,
    }
  }
}


const Schemas = [
  userRegisterSchema,
  userLoginSchema,
  taskCreateSchema,
  taskUpdateSchema,
  taskAssignSchema, 
  taskTagSchema,
  taskStatusSchema
]

export default Schemas