/**
 * Global auth middleware — protects routes requiring authentication.
 * Uses server-side Redis sessions via HTTP-only cookie.
 *
 * - /admin/* → requires isAuthenticated + isAdmin
 * - /dashboard/* → requires isAuthenticated
 * - /auth/* → redirects to home if already authenticated
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  // Initialize session from server (runs once, works SSR + client)
  if (auth.isLoading.value) {
    await auth.init()
  }

  const isAuth = auth.isAuthenticated.value
  const isAdmin = auth.isAdmin.value

  // ── Admin routes: must be authenticated + admin ──
  if (to.path.startsWith('/admin')) {
    if (!isAuth) {
      return navigateTo('/auth/login?redirect=' + encodeURIComponent(to.fullPath))
    }
    if (!isAdmin) {
      return navigateTo('/')
    }
  }

  // ── Dashboard routes: must be authenticated ──
  if (to.path.startsWith('/dashboard')) {
    if (!isAuth) {
      return navigateTo('/auth/login?redirect=' + encodeURIComponent(to.fullPath))
    }
  }

  // ── Auth pages: redirect if already logged in ──
  if (to.path.startsWith('/auth/') && isAuth) {
    if (isAdmin) return navigateTo('/admin')
    return navigateTo('/dashboard')
  }
})
