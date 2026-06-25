import type { User, AuthTokens, LoginRequest, RegisterRequest, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)
  const isAuthenticated = computed(() => !!user.value && !!tokens.value)

  async function login(credentials: LoginRequest) {
    const response = await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
    user.value = response.user
    tokens.value = response.tokens
    if (import.meta.client) {
      localStorage.setItem('vd-auth-tokens', JSON.stringify(response.tokens))
    }
  }

  async function register(data: RegisterRequest) {
    const response = await $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: data,
    })
    user.value = response.user
    tokens.value = response.tokens
    if (import.meta.client) {
      localStorage.setItem('vd-auth-tokens', JSON.stringify(response.tokens))
    }
  }

  function logout() {
    user.value = null
    tokens.value = null
    if (import.meta.client) {
      localStorage.removeItem('vd-auth-tokens')
    }
  }

  async function refreshToken() {
    if (!tokens.value?.refreshToken) return

    const response = await $fetch<AuthTokens>('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken: tokens.value.refreshToken },
    })
    tokens.value = response
    if (import.meta.client) {
      localStorage.setItem('vd-auth-tokens', JSON.stringify(response))
    }
  }

  return { user, tokens, isAuthenticated, login, logout, register, refreshToken }
})
