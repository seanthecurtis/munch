export type User = {
  id?: string,
  email: string,
  password?: string,
  createdAt?: string
  updatedAt?: string
}

export type UserQueryParams = {
  email?: string
}

export type Task = {
  id?: string,
  userId: string,
  title: string,
  description?: string,
  priority?: string,
  dueDate: string,
  labels?: array,
  status?: string,
  createdAt?: string
  updatedAt?: string
}

export type TaskStatusUpdate = {
  status: string
}

export type JwtTokenData = {
  userId: string
}

export type ParamGeneric = {
  id: string
}

export type Label = {
  id?: string
  label: string
}

export type LabelFilters = {
  id?: string,
  label?: string
}

export type TaskQueryParams = {
  status?: string,
  priorityOrder?: string,
  dueDateOrder?: string
}

export type TaskListFilters = {
  status?: string
  priorityOrder?: string
  dueDateOrder?: string
}

export type TaskLabel = {
  taskId?: string,
  labelId?: string
}