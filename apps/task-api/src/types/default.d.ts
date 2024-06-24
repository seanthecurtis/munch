export type User = {
  id?: string,
  email: string,
  password?: string,
  createdAt?: string
  updatedAt?: string
}

export type UserFilters = {
  email?: string
}

export type Task = {
  id?: string,
  userId: string,
  title: string,
  description?: string,
  priority?: string,
  dueDate: string,
  status?: string,
  createdAt?: string
  updatedAt?: string
}

export type TaskUpdate = {
  userId: string,
  title: string,
  description?: string,
  priority?: string,
  dueDate: string,
  status?: string
}

export type TaskAssignUser = {
  userId: string
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