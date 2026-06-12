<template>
  <div class="auth-page">
    <div class="auth-page__side">
      <div class="auth-page__brand">
        <NuxtLink to="/">
          <img src="/logo.png" alt="CAP ALI" width="60" height="60" >
        </NuxtLink>
        <h1>CAP <strong>ALI</strong></h1>
        <p>Communauté d'Appui au Parcours des Africains et Leaders Inspirants</p>
      </div>
    </div>

    <div class="auth-page__main">
      <div class="auth-card">
        <h2 class="auth-card__title">Connexion</h2>
        <p class="auth-card__subtitle">Accédez à votre espace CAP ALI</p>

        <div v-if="error" class="auth-alert auth-alert--error">{{ error }}</div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="votre@email.com" required autocomplete="email" >
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <div class="input-password">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required autocomplete="current-password" >
              <button type="button" class="input-password__toggle" :aria-label="showPassword ? 'Masquer' : 'Afficher'" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--lg" :disabled="isLoading" style="width: 100%">
            <span v-if="isLoading" class="spinner" />
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="auth-card__footer">
          <span>Pas encore de compte ?</span>
          <NuxtLink to="/auth/register" class="auth-link">Créer un compte</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  try {
    const { user } = await login(form.email, form.password)

    // Redirect based on role
    const redirect = route.query.redirect as string
    if (redirect) {
      router.push(redirect)
    } else if (user.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Erreur de connexion. Vérifiez vos identifiants.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
}

.auth-page__side {
  width: 45%;
  background: linear-gradient(135deg, var(--green-700) 0%, var(--green-500) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  position: relative;
  overflow: hidden;
}

.auth-page__side::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(212, 160, 23, 0.08);
  top: -100px;
  right: -100px;
}

.auth-page__side::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(199, 55, 47, 0.06);
  bottom: -80px;
  left: -60px;
}

.auth-page__brand {
  text-align: center;
  color: var(--neutral-0);
  position: relative;
  z-index: 1;
}

.auth-page__brand img {
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.auth-page__brand h1 {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
}

.auth-page__brand strong {
  color: var(--gold-400);
}

.auth-page__brand p {
  font-size: var(--text-base);
  line-height: 1.7;
  opacity: 0.85;
  max-width: 320px;
}

.auth-page__main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: #f7f8fa;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: var(--neutral-0);
  border-radius: var(--radius-2xl);
  padding: var(--space-10);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.auth-card__title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-1);
}

.auth-card__subtitle {
  font-size: var(--text-sm);
  color: var(--neutral-500);
  margin-bottom: var(--space-8);
}

.auth-alert {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
}

.auth-alert--error {
  background: var(--red-50);
  color: var(--red-600);
  border: 1px solid rgba(199, 55, 47, 0.15);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-700);
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  background: var(--neutral-0);
  color: var(--neutral-800);
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

.form-input:focus {
  outline: none;
  border-color: var(--green-400);
  box-shadow: 0 0 0 3px rgba(27, 107, 58, 0.1);
}

.input-password {
  position: relative;
}

.input-password .form-input {
  padding-right: 44px;
}

.input-password__toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--neutral-400);
  padding: 4px;
}

.input-password__toggle:hover {
  color: var(--neutral-600);
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-card__footer {
  text-align: center;
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--neutral-100);
  font-size: var(--text-sm);
  color: var(--neutral-500);
}

.auth-link {
  color: var(--green-600);
  font-weight: 600;
  margin-left: var(--space-1);
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-page { flex-direction: column; }
  .auth-page__side { width: 100%; min-height: 200px; padding: var(--space-8); }
  .auth-page__brand h1 { font-size: var(--text-2xl); }
  .auth-page__brand p { display: none; }
  .auth-card { padding: var(--space-6); }
}
</style>
