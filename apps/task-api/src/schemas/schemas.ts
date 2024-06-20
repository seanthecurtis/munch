export const userRegisterSchema = {
  $id: "registerSchema",
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", errorMessage: "Invalid email format" },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 128,
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

export const userLoginSchema = {
  $id: "loginSchema",
  body: {
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

export const taskCreateSchema = {
  $id: "taskCreateSchema",
  body: {
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
        default: "low",
        errorMessage: {
          enum: "Priority options: low, medium, high."
        }
      },
      status: {
        type: "string",
        enum: ["open", "in progress", "completed"],
        default: "open",
        errorMessage: {
          enum: "Status options: 'open', 'in progress', 'completed'."
        }
      },
    },
    errorMessage: {
      required: {
        title: "Title is required",
        due_date: "A due date is required",
      }
    }
  }
}


export const taskUpdateSchema = {
  $id: "taskUpdateSchema",
  body: {
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
        enum: ["Low", "Medium", "High"],
        errorMessage: {
          enum: "Priority options: low, medium, high."
        }
      },
    }
  }
}
