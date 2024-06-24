export interface HttpError extends Error {
  statusCode?: number
  message: string
}

export interface TaskListFilters {
  status?: string
  priorityOrder?: string
  dueDateOrder?: string
}