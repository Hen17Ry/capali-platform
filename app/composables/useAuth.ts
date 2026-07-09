// app/composables/useAuth.ts

// --- Types ---
export interface AuthUser {
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

// ============================================================================
// 1. LE STORE (Responsabilité : Gérer l'état de l'application)
// ============================================================================
export const useAuthStore = () => {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isMentor: false,
    isLoading: true,
  }))

  const setUser = (user: AuthUser) => {
    authState.value.user = user
    authState.value.isAuthenticated = true
    authState.value.isAdmin = user.isAdmin
    authState.value.isMentor = user.status === 'mentor'
  }

  const clearUser = () => {
    authState.value.user = null
    authState.value.isAuthenticated = false
    authState.value.isAdmin = false
    authState.value.isMentor = false
  }

  const setLoading = (loading: boolean) => {
    authState.value.isLoading = loading
  }

  return { state: authState, setUser, clearUser, setLoading }
}

// ============================================================================
// 2. LE SERVICE (Responsabilité : Appels API, Logique métier et Redirections)
// ============================================================================
export const useAuth = () => {
  const store = useAuthStore()

  /**
   * Récupère la session depuis le serveur (Gère SSR et Client)
   */
  const fetchSession = async (): Promise<AuthUser | null> => {
    try {
      const response = await $fetch<{ data: AuthUser }>('/api/auth/me', {
        headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
      })
      store.setUser(response.data)
      return response.data
    } catch (error) {
      // CORRECTION : Plus de catch vide (empty-catch)
      console.warn('[useAuth] Session introuvable ou expirée.', error)
      store.clearUser()
      return null
    }
  }

  /**
   * Initialise l'authentification (exécuté une seule fois par requête)
   */
  const init = async () => {
    if (!store.state.value.isLoading) return
    await fetchSession()
    store.setLoading(false)
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  const register = async (data: Record<string, any>) => {
    const response = await $fetch<{ data: { user: AuthUser } }>(
      '/api/auth/register',
      { method: 'POST', body: data }
    )
    store.setUser(response.data.user)
    store.setLoading(false)
    return response.data
  }

  /**
   * Connexion avec email/mot de passe
   */
  const login = async (email: string, password: string) => {
    const response = await $fetch<{ data: { user: AuthUser } }>(
      '/api/auth/login',
      { method: 'POST', body: { email, password } }
    )
    store.setUser(response.data.user)
    store.setLoading(false)
    return response.data
  }

  /**
   * Déconnexion (Détruit la session côté serveur et nettoie l'état)
   */
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // CORRECTION : On log l'erreur réseau même si on force la déconnexion locale
      console.error('[useAuth] Erreur API lors de la déconnexion réseau:', error)
    } finally {
      store.clearUser()
      store.setLoading(true) 
      navigateTo('/auth/login')
    }
  }

  return {
    user: computed(() => store.state.value.user),
    isAuthenticated: computed(() => store.state.value.isAuthenticated),
    isAdmin: computed(() => store.state.value.isAdmin),
    isMentor: computed(() => store.state.value.isMentor),
    isLoading: computed(() => store.state.value.isLoading),
    init,
    register,
    login,
    logout,
    fetchSession,
  }
}