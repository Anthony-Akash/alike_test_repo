export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface ApiError {
  statusCode: number
  statusMessage: string
  message: string
  data?: Record<string, unknown>
}

export interface SearchResult<T> {
  items: T[]
  total: number
  query: string
  filters: Record<string, string>
  suggestions?: string[]
}
