import type { Address } from './order'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  preferredLanguage: 'en' | 'ar'
  addresses: Address[]
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  preferredLanguage?: 'en' | 'ar'
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
