import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  // const { trackEvent } = useTracking()

  async function login(credentials: { email: string, password: string }) {
    await authStore.login(credentials)
    // trackEvent({
    //   event_name: 'login',
    //   event_cat: 'Auth',
    //   event_act: 'Login Success',
    // })
    router.push('/')
  }

  async function register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) {
    await authStore.register(data)
    // trackEvent({
    //   event_name: 'register',
    //   event_cat: 'Auth',
    //   event_act: 'Register Success',
    // })
    router.push('/')
  }

  async function logout() {
    await authStore.logout()
    // trackEvent({
    //   event_name: 'logout',
    //   event_cat: 'Auth',
    //   event_act: 'Logout',
    // })
    router.push('/auth/login')
  }

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  return { login, register, logout, user, isAuthenticated }
}
