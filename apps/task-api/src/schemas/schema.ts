// All schemas for ajv to manage payload validation
// Enhancement to move schemas to routes groups - limited amount as of now

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
        email: "email is required",
        password: "password is required"
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
        email: "email is required",
        password: "password is required"
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
          minLength: "title may not be empty.",
          maxLength: "title exceeds 100 characters."
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
          minLength: "description may not be empty.",
          maxLength: "description exceeds 255 characters."
        }
      },
      dueDate: {
        type: "string"
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        errorMessage: {
          enum: "priority options: low, medium, high."
        }
      },
      status: {
        type: "string",
        enum: ["open", "in progress", "completed"],
        errorMessage: {
          enum: "status options: 'open', 'in progress', 'completed'."
        }
      },
    },
    errorMessage: {
      required: {
        title: "title is required",
        dueDate: "dueDate is required",
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
          minLength: "title may not be empty.",
          maxLength: "title exceeds 100 characters."
        }
      },
      description: {
        type: "string",
        minLength: 1,
        maxLength: 255,
        errorMessage: {
          minLength: "description may not be empty.",
          maxLength: "description exceeds 255 characters."
        }
      },
      dueDate: {
        type: "string"
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        errorMessage: {
          enum: "priority options: Low, Medium, High."
        }
      },
      status: {
        type: "string",
        enum: ["open", "in progress", "completed"],
        errorMessage: {
          enum: "status options: 'open', 'in progress', 'completed'."
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
  },
  errorMessage: {
    required: {
      status: "Status is required",
    }
  }
}

// Export all schemas
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