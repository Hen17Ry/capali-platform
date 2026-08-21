<template>
  <div class="auth-page">
    <div class="auth-page__side">
      <div class="auth-page__brand">
        <NuxtLink to="/">
          <img src="/logo.png" alt="CAP ALI" width="60" height="60" >
        </NuxtLink>
        <h1>CAP <strong>ALI</strong></h1>
      </div>
    </div>

    <div class="auth-page__main">
      <div class="auth-card">
        <h2 class="auth-card__title">Nouveau mot de passe</h2>
        <p class="auth-card__subtitle">Créez votre nouveau mot de passe.</p>

        <div v-if="error" class="auth-alert auth-alert--error">{{ error }}</div>
        <div v-if="successMessage" class="auth-alert auth-alert--success">
          {{ successMessage }}
          <div class="mt-4">
            <NuxtLink to="/auth/login" class="btn btn--primary btn--sm" style="width: 100%; display: block; text-align: center; text-decoration: none;">
              Aller à la connexion
            </NuxtLink>
          </div>
        </div>

        <form v-if="!successMessage" class="auth-form" @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label class="form-label">Nouveau mot de passe</label>
            <div class="input-password">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required minlength="8" >
              <button type="button" class="input-password__toggle" :aria-label="showPassword ? 'Masquer' : 'Afficher'" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirmez le mot de passe</label>
            <div class="input-password">
              <input v-model="form.passwordConfirm" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required minlength="8" >
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--lg" :disabled="isLoading" style="width: 100%">
            <span v-if="isLoading" class="spinner" />
            {{ isLoading ? 'Enregistrement...' : 'Réinitialiser le mot de passe' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const token = route.query.token as string

const form = reactive({ password: '', passwordConfirm: '' })
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

onMounted(() => {
  if (!token) {
    error.value = "Le lien de réinitialisation est invalide ou manquant."
  }
})

async function handleResetPassword() {
  if (!token) return

  if (form.password !== form.passwordConfirm) {
    error.value = "Les mots de passe ne correspondent pas."
    return
  }
  
  if (form.password.length < 8) {
    error.value = "Le mot de passe doit contenir au moins 8 caractères."
    return
  }

  error.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        token,
        newPassword: form.password 
      }
    })
    
    successMessage.value = 'Votre mot de passe a été réinitialisé avec succès !'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.data?.message || 'Ce lien a expiré ou est invalide.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page { display: flex; min-height: 100vh; }
.auth-page__side { width: 45%; background: linear-gradient(135deg, var(--green-700) 0%, var(--green-500) 100%); display: flex; align-items: center; justify-content: center; padding: var(--space-12); position: relative; overflow: hidden; }
.auth-page__side::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(212, 160, 23, 0.08); top: -100px; right: -100px; }
.auth-page__side::after { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: rgba(199, 55, 47, 0.06); bottom: -80px; left: -60px; }
.auth-page__brand { text-align: center; color: var(--neutral-0); position: relative; z-index: 1; }
.auth-page__brand img { border-radius: var(--radius-full); margin-bottom: var(--space-6); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); }
.auth-page__brand h1 { font-family: var(--font-serif); font-size: var(--text-4xl); margin-bottom: var(--space-4); }
.auth-page__brand strong { color: var(--gold-400); }
.auth-page__main { flex: 1; display: flex; align-items: center; justify-content: center; padding: var(--space-8); background: #f7f8fa; }
.auth-card { width: 100%; max-width: 440px; background: var(--neutral-0); border-radius: var(--radius-2xl); padding: var(--space-10); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); }

.auth-card__title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.auth-card__subtitle { font-size: var(--text-sm); color: var(--neutral-500); margin-bottom: var(--space-8); }
.auth-alert { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: var(--text-sm); margin-bottom: var(--space-6); }
.auth-alert--error { background: var(--red-50); color: var(--red-600); border: 1px solid rgba(199, 55, 47, 0.15); }
.auth-alert--success { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
.auth-form { display: flex; flex-direction: column; gap: var(--space-5); }
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); }
.form-input { width: 100%; padding: var(--space-3) var(--space-4); font-size: var(--text-sm); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-800); transition: all var(--transition-fast); }
.form-input:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27, 107, 58, 0.1); }
.input-password { position: relative; }
.input-password .form-input { padding-right: 44px; }
.input-password__toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400); padding: 4px; cursor: pointer; border: none; background: transparent; }
.input-password__toggle:hover { color: var(--neutral-600); }
.spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
.mt-4 { margin-top: 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) { .auth-page { flex-direction: column; } .auth-page__side { width: 100%; min-height: 200px; padding: var(--space-8); } .auth-card { padding: var(--space-6); } }
</style>
