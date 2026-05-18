<template>
  <div class="auth-page">
    <div class="auth-page__side">
      <div class="auth-page__brand">
        <NuxtLink to="/"><img src="/logo.png" alt="CAP ALI" width="60" height="60" ></NuxtLink>
        <h1>CAP <strong>ALI</strong></h1>
        <p>Rejoins la communauté qui accompagne les parcours d'excellence</p>
      </div>
    </div>

    <div class="auth-page__main">
      <div class="auth-card">
        <h2 class="auth-card__title">Créer un compte</h2>
        <p class="auth-card__subtitle">Rejoins CAP ALI gratuitement</p>

        <div v-if="error" class="auth-alert auth-alert--error">{{ error }}</div>
        <div v-if="success" class="auth-alert auth-alert--success">{{ success }}</div>

        <!-- Step indicator -->
        <div class="steps">
          <div v-for="s in totalSteps" :key="s" class="step" :class="{ 'step--active': step === s, 'step--done': step > s }">
            <span class="step__num">{{ s }}</span>
            <span class="step__label">{{ stepLabels[s - 1] }}</span>
          </div>
        </div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <!-- STEP 1: Role + Identity -->
          <template v-if="step === 1">
            <div class="form-group">
              <label class="form-label">Je suis *</label>
              <div class="role-selector">
                <label v-for="role in roles" :key="role.value" class="role-option" :class="{ 'role-option--selected': form.status === role.value }">
                  <input v-model="form.status" type="radio" :value="role.value" class="sr-only" >
                  <span class="role-option__label">{{ role.label }}</span>
                  <span class="role-option__desc">{{ role.desc }}</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Nom complet *</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Prénom et nom" required >
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Pays d'origine</label>
                <input v-model="form.countryOrigin" type="text" class="form-input" placeholder="Ex: Bénin" >
              </div>
              <div class="form-group">
                <label class="form-label">Ville en France</label>
                <input v-model="form.cityCurrentFr" type="text" class="form-input" placeholder="Ex: Paris" >
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Domaine {{ form.status === 'mentor' ? '*' : '' }}</label>
              <input v-model="form.domain" type="text" class="form-input" placeholder="Ex: Informatique, Droit..." :required="form.status === 'mentor'" >
            </div>
            <button type="button" class="btn btn--primary btn--lg" style="width:100%" @click="nextStep">Continuer</button>
          </template>

          <!-- STEP 2: Details (Mentor or Student specific) -->
          <template v-if="step === 2">
            <!-- MENTOR DETAILS -->
            <template v-if="form.status === 'mentor'">
              <div class="form-group">
                <label class="form-label">Sur quoi pouvez-vous aider ? *</label>
                <div class="checkbox-grid">
                  <label v-for="t in helpTopicOptions" :key="t.value" class="checkbox-card" :class="{ 'checkbox-card--checked': form.helpTopics.includes(t.value) }">
                    <input v-model="form.helpTopics" type="checkbox" :value="t.value" class="sr-only" >
                    <span>{{ t.label }}</span>
                  </label>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Heures/mois disponibles *</label>
                  <select v-model.number="form.availableHoursMonth" class="form-select">
                    <option :value="2">2h</option><option :value="4">4h</option><option :value="6">6h</option><option :value="8">8h</option><option :value="10">10h+</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Max mentoré(e)s *</label>
                  <select v-model.number="form.maxMentees" class="form-select">
                    <option :value="1">1</option><option :value="2">2</option><option :value="3">3</option><option :value="5">5</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Mode d'accompagnement *</label>
                <div class="checkbox-grid">
                  <label class="checkbox-card" :class="{ 'checkbox-card--checked': form.acceptsRemote }">
                    <input v-model="form.acceptsRemote" type="checkbox" class="sr-only" >
                    <span>À distance</span>
                  </label>
                  <label class="checkbox-card" :class="{ 'checkbox-card--checked': form.acceptsInperson }">
                    <input v-model="form.acceptsInperson" type="checkbox" class="sr-only" >
                    <span>En présentiel</span>
                  </label>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Années en France</label>
                  <input v-model.number="form.yearsInFrance" type="number" min="0" max="50" class="form-input" placeholder="Ex: 5" >
                </div>
                <div class="form-group">
                  <label class="form-label">Langues parlées</label>
                  <input v-model="languagesInput" type="text" class="form-input" placeholder="Français, Anglais, Fon..." >
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Qu'est-ce qui vous motive à devenir mentor ? *</label>
                <textarea v-model="form.motivation" class="form-textarea" rows="3" placeholder="Partagez votre motivation en quelques lignes..." required maxlength="500" />
                <span class="char-count">{{ form.motivation.length }}/500</span>
              </div>
              <div class="form-group">
                <label class="form-label">LinkedIn (optionnel)</label>
                <input v-model="form.linkedinUrl" type="url" class="form-input" placeholder="https://linkedin.com/in/..." >
              </div>
              <div class="mentor-notice">
                <p>⚠️ Votre profil mentor sera <strong>validé par un administrateur</strong> avant de pouvoir accompagner des mentorés.</p>
              </div>
            </template>

            <!-- STUDENT DETAILS -->
            <template v-else>
              <div class="form-group">
                <label class="form-label">De quoi as-tu besoin d'aide ?</label>
                <div class="checkbox-grid">
                  <label v-for="t in helpTopicOptions" :key="t.value" class="checkbox-card" :class="{ 'checkbox-card--checked': form.needsHelp.includes(t.value) }">
                    <input v-model="form.needsHelp" type="checkbox" :value="t.value" class="sr-only" >
                    <span>{{ t.label }}</span>
                  </label>
                </div>
              </div>
              <div v-if="form.status === 'predeparture'" class="form-group">
                <label class="form-label">Date d'arrivée prévue</label>
                <input v-model="form.arrivalDate" type="month" class="form-input" >
              </div>
            </template>

            <div class="form-actions-row">
              <button type="button" class="btn btn--outline" @click="step = 1">← Retour</button>
              <button type="button" class="btn btn--primary btn--lg" style="flex:1" @click="nextStep">Continuer</button>
            </div>
          </template>

          <!-- STEP 3: Credentials -->
          <template v-if="step === 3">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="votre@email.com" required autocomplete="email" >
            </div>
            <div class="form-group">
              <label class="form-label">Mot de passe *</label>
              <div class="input-password">
                <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="form-input" placeholder="Minimum 8 caractères" required minlength="8" >
                <button type="button" class="input-password__toggle" @click="showPw = !showPw">👁</button>
              </div>
              <div class="password-strength"><div class="password-strength__bar" :style="{ width: pwStrength + '%' }" :class="pwClass" /></div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirmer le mot de passe *</label>
              <input v-model="form.confirmPassword" :type="showPw ? 'text' : 'password'" class="form-input" placeholder="Répétez le mot de passe" required >
            </div>
            <div class="form-actions-row">
              <button type="button" class="btn btn--outline" @click="step = 2">← Retour</button>
              <button type="submit" class="btn btn--primary btn--lg" :disabled="isLoading" style="flex:1">
                {{ isLoading ? 'Création...' : 'Créer mon compte' }}
              </button>
            </div>
          </template>
        </form>

        <div class="auth-card__footer">
          <span>Déjà un compte ?</span>
          <NuxtLink to="/auth/login" class="auth-link">Se connecter</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const { register } = useAuth()
const router = useRouter()

const step = ref(1)
const totalSteps = computed(() => 3)
const stepLabels = ['Profil', 'Détails', 'Compte']
const showPw = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const languagesInput = ref('Français')

const form = reactive({
  name: '', email: '', password: '', confirmPassword: '',
  status: 'predeparture',
  countryOrigin: '', cityCurrentFr: '', domain: '',
  // Mentor
  helpTopics: [] as string[],
  motivation: '',
  availableHoursMonth: 4,
  maxMentees: 2,
  acceptsRemote: true,
  acceptsInperson: false,
  yearsInFrance: undefined as number | undefined,
  linkedinUrl: '',
  // Student
  needsHelp: [] as string[],
  arrivalDate: '',
})

const roles = [
  { value: 'predeparture', label: 'Étudiant / Pré-départ', desc: 'Je prépare mon arrivée' },
  { value: 'newcomer', label: 'Nouvel arrivant', desc: 'En France depuis peu' },
  { value: 'installed', label: 'Installé', desc: 'Je vis en France' },
  { value: 'mentor', label: 'Mentor', desc: 'Je veux accompagner' },
]

const helpTopicOptions = [
  { value: 'logement', label: '🏠 Logement' },
  { value: 'etudes', label: '📚 Études' },
  { value: 'emploi', label: '💼 Emploi' },
  { value: 'administratif', label: '📋 Démarches admin' },
  { value: 'vie_quotidienne', label: '🛒 Vie quotidienne' },
  { value: 'sante', label: '🏥 Santé' },
  { value: 'integration', label: '🤝 Intégration sociale' },
  { value: 'orientation', label: '🧭 Orientation' },
]

const pwStrength = computed(() => {
  const p = form.password; let s = 0
  if (p.length >= 8) s += 25; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s += 25
  if (/\d/.test(p)) s += 25; if (/[^a-zA-Z0-9]/.test(p)) s += 25; return s
})
const pwClass = computed(() => pwStrength.value <= 25 ? 'str--weak' : pwStrength.value <= 50 ? 'str--fair' : pwStrength.value <= 75 ? 'str--good' : 'str--strong')

function nextStep() {
  error.value = ''
  if (step.value === 1) {
    if (!form.name.trim()) { error.value = 'Le nom est obligatoire.'; return }
    if (form.status === 'mentor' && !form.domain.trim()) { error.value = 'Le domaine est obligatoire pour les mentors.'; return }
  }
  if (step.value === 2 && form.status === 'mentor') {
    if (!form.helpTopics.length) { error.value = 'Sélectionnez au moins un sujet d\'aide.'; return }
    if (!form.motivation.trim()) { error.value = 'La motivation est obligatoire.'; return }
    if (!form.acceptsRemote && !form.acceptsInperson) { error.value = 'Choisissez au moins un mode d\'accompagnement.'; return }
  }
  step.value++
}

async function handleRegister() {
  error.value = ''; success.value = ''
  if (form.password !== form.confirmPassword) { error.value = 'Les mots de passe ne correspondent pas.'; return }
  isLoading.value = true
  try {
    const langs = languagesInput.value.split(',').map(l => l.trim()).filter(Boolean)
    const { user } = await register({
      ...form,
      languages: langs,
      linkedinUrl: form.linkedinUrl || undefined,
      arrivalDate: form.arrivalDate || undefined,
    })
    if (user.status === 'mentor') {
      success.value = 'Compte créé ! Votre profil mentor est en attente de validation.'
      setTimeout(() => router.push('/auth/login'), 3000)
    } else {
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Erreur lors de la création du compte.'
  } finally { isLoading.value = false }
}
</script>

<style scoped>
.auth-page { display: flex; min-height: 100vh; }
.auth-page__side { width: 38%; background: linear-gradient(135deg, var(--green-700), var(--green-500)); display: flex; align-items: center; justify-content: center; padding: var(--space-12); position: relative; overflow: hidden; }
.auth-page__side::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(212,160,23,0.08); top: -100px; right: -100px; }
.auth-page__brand { text-align: center; color: var(--neutral-0); position: relative; z-index: 1; }
.auth-page__brand img { border-radius: var(--radius-full); margin-bottom: var(--space-6); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.auth-page__brand h1 { font-family: var(--font-serif); font-size: var(--text-4xl); margin-bottom: var(--space-4); }
.auth-page__brand strong { color: var(--gold-400); }
.auth-page__brand p { font-size: var(--text-base); line-height: 1.7; opacity: 0.85; max-width: 300px; }
.auth-page__main { flex: 1; display: flex; align-items: center; justify-content: center; padding: var(--space-8); background: #f7f8fa; overflow-y: auto; }
.auth-card { width: 100%; max-width: 540px; background: var(--neutral-0); border-radius: var(--radius-2xl); padding: var(--space-10); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
.auth-card__title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.auth-card__subtitle { font-size: var(--text-sm); color: var(--neutral-500); margin-bottom: var(--space-6); }
.steps { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-8); }
.step { display: flex; align-items: center; gap: var(--space-2); flex: 1; }
.step__num { width: 28px; height: 28px; border-radius: var(--radius-full); border: 2px solid var(--neutral-200); display: flex; align-items: center; justify-content: center; font-size: var(--text-xs); font-weight: 600; color: var(--neutral-400); transition: all 0.2s; }
.step--active .step__num { border-color: var(--green-500); background: var(--green-500); color: white; }
.step--done .step__num { border-color: var(--green-500); background: var(--green-50); color: var(--green-600); }
.step__label { font-size: var(--text-xs); font-weight: 500; color: var(--neutral-400); }
.step--active .step__label { color: var(--neutral-900); }
.auth-alert { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: var(--text-sm); margin-bottom: var(--space-6); }
.auth-alert--error { background: var(--red-50); color: var(--red-600); border: 1px solid rgba(199,55,47,0.15); }
.auth-alert--success { background: var(--green-50); color: var(--green-600); border: 1px solid rgba(27,107,58,0.15); }
.auth-form { display: flex; flex-direction: column; gap: var(--space-5); }
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); }
.form-input, .form-select, .form-textarea { width: 100%; padding: var(--space-3) var(--space-4); font-size: var(--text-sm); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-800); font-family: var(--font-sans); }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.form-textarea { resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.role-option { padding: var(--space-3); border: 2px solid var(--neutral-200); border-radius: var(--radius-lg); cursor: pointer; text-align: center; transition: all 0.2s; }
.role-option:hover { border-color: var(--green-300); }
.role-option--selected { border-color: var(--green-500); background: var(--green-50); }
.role-option__label { display: block; font-size: var(--text-sm); font-weight: 600; color: var(--neutral-800); }
.role-option__desc { font-size: 11px; color: var(--neutral-400); }
.checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.checkbox-card { padding: var(--space-2) var(--space-3); border: 1.5px solid var(--neutral-200); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); text-align: center; transition: all 0.15s; }
.checkbox-card:hover { border-color: var(--green-300); }
.checkbox-card--checked { border-color: var(--green-500); background: var(--green-50); color: var(--green-700); font-weight: 500; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
.input-password { position: relative; }
.input-password .form-input { padding-right: 44px; }
.input-password__toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 16px; }
.password-strength { height: 4px; background: var(--neutral-100); border-radius: 2px; margin-top: var(--space-2); overflow: hidden; }
.password-strength__bar { height: 100%; border-radius: 2px; transition: all 0.3s; }
.str--weak { background: var(--red-500); } .str--fair { background: var(--gold-500); } .str--good { background: #3b82f6; } .str--strong { background: var(--green-500); }
.char-count { font-size: 11px; color: var(--neutral-400); text-align: right; }
.mentor-notice { padding: var(--space-3); background: var(--gold-50); border: 1px solid rgba(212,160,23,0.2); border-radius: var(--radius-md); }
.mentor-notice p { font-size: var(--text-sm); color: var(--gold-700); line-height: 1.5; }
.form-actions-row { display: flex; gap: var(--space-3); }
.auth-card__footer { text-align: center; margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid var(--neutral-100); font-size: var(--text-sm); color: var(--neutral-500); }
.auth-link { color: var(--green-600); font-weight: 600; margin-left: var(--space-1); }
.auth-link:hover { text-decoration: underline; }
@media (max-width: 768px) {
  .auth-page { flex-direction: column; }
  .auth-page__side { width: 100%; min-height: 160px; padding: var(--space-6); }
  .auth-page__brand h1 { font-size: var(--text-2xl); }
  .auth-page__brand p { display: none; }
  .auth-card { padding: var(--space-6); }
  .role-selector, .checkbox-grid, .form-row { grid-template-columns: 1fr; }
}
</style>
