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
        <NuxtLink to="/auth/login" class="back-link">← Retour</NuxtLink>
        
        <h2 class="auth-card__title">Mot de passe oublié</h2>
        <p class="auth-card__subtitle">Saisissez votre adresse email pour recevoir un lien de réinitialisation.</p>

        <div v-if="error" class="auth-alert auth-alert--error">{{ error }}</div>
        <div v-if="successMessage" class="auth-alert auth-alert--success">{{ successMessage }}</div>

        <form v-if="!successMessage" class="auth-form" @submit.prevent="handleForgotPassword">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="email" type="email" class="form-input" placeholder="votre@email.com" required autocomplete="email" >
          </div>

          <button type="submit" class="btn btn--primary btn--lg" :disabled="isLoading" style="width: 100%">
            <span v-if="isLoading" class="spinner" />
            {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const email = ref('')
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

async function handleForgotPassword() {
  error.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const res = await $fetch<{ message?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    successMessage.value = res.message || 'Si cette adresse correspond à un compte, un email a été envoyé avec les instructions.'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.data?.message || 'Une erreur est survenue.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Re-use exact same styles from login.vue */
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

.back-link { font-size: 13px; color: var(--neutral-500); display: inline-block; margin-bottom: var(--space-4); transition: color 0.2s; }
.back-link:hover { color: var(--green-600); }

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
.spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) { .auth-page { flex-direction: column; } .auth-page__side { width: 100%; min-height: 200px; padding: var(--space-8); } .auth-card { padding: var(--space-6); } }
</style>
