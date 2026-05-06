interface AuthUser {
  id: string
  name: string
  email: string
  status: string
  isAdmin: boolean
  avatarUrl: string | null
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isMentor: boolean
  isLoading: boolean
}

/**
 * Auth composable using Redis server-side sessions.
 *
 * Uses `useState()` so the auth state is:
 * - Isolated per-request on SSR (no cross-request bleed)
 * - Shared across components within the same request/page
 * - Transferred to the client via Nuxt payload (no flash)
 */
export const useAuth = () => {
  // useState is SSR-safe: isolated per request on server, singleton on client
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isMentor: false,
    isLoading: true,
  }))

  /**
   * Fetch current session from server (works SSR + client).
   * The session cookie is forwarded via useRequestHeaders on SSR.
   */
  const fetchSession = async (): Promise<AuthUser | null> => {
    try {
      const response = await $fetch<{ data: AuthUser }>('/api/auth/me', {
        headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
      })
      setUser(response.data)
      return response.data
    } catch {
      clearUser()
      return null
    }
  }

  /**
   * Initialize auth — fetches the session from the server once per request.
   */
  const init = async () => {
    // Skip if already initialized (isLoading starts as true, set to false after init)
    if (!authState.value.isLoading) return

    await fetchSession()
    authState.value.isLoading = false
  }

  /**
   * Set user in state
   */
  const setUser = (user: AuthUser) => {
    authState.value.user = user
    authState.value.isAuthenticated = true
    authState.value.isAdmin = user.isAdmin
    authState.value.isMentor = user.status === 'mentor'
  }

  /**
   * Clear state
   */
  const clearUser = () => {
    authState.value.user = null
    authState.value.isAuthenticated = false
    authState.value.isAdmin = false
    authState.value.isMentor = false
  }

  /**
   * Register a new user
   */
  const register = async (data: {
    name: string
    email: string
    password: string
    status: string
    countryOrigin?: string
    cityCurrentFr?: string
    domain?: string
    helpTopics?: string[]
    motivation?: string
    availableHoursMonth?: number
    maxMentees?: number
    acceptsRemote?: boolean
    acceptsInperson?: boolean
    yearsInFrance?: number
    languages?: string[]
    linkedinUrl?: string
    presentation?: string
    needsHelp?: string[]
    arrivalDate?: string
    [key: string]: unknown
  }) => {
    const response = await $fetch<{ data: { user: AuthUser } }>(
      '/api/auth/register',
      { method: 'POST', body: data }
    )

    setUser(response.data.user)
    authState.value.isLoading = false

    return response.data
  }

  /**
   * Login with email/password
   */
  const login = async (email: string, password: string) => {
    const response = await $fetch<{ data: { user: AuthUser } }>(
      '/api/auth/login',
      { method: 'POST', body: { email, password } }
    )

    setUser(response.data.user)
    authState.value.isLoading = false

    return response.data
  }

  /**
   * Logout — calls server to destroy session + clear cookie
   */
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Even if the API fails, clear local state
    }

    clearUser()
    authState.value.isLoading = true // Reset so init re-runs after re-login
    navigateTo('/auth/login')
  }

  return {
    // Expose individual computed refs for template usage
    user: computed(() => authState.value.user),
    isAuthenticated: computed(() => authState.value.isAuthenticated),
    isAdmin: computed(() => authState.value.isAdmin),
    isMentor: computed(() => authState.value.isMentor),
    isLoading: computed(() => authState.value.isLoading),
    init,
    register,
    login,
    logout,
    fetchSession,
  }
}
