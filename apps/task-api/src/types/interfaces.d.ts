// Http error interface
export interface HttpError extends Error {
  statusCode?: number
  message: string
}