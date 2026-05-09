<template>
  <div class="profile-page">
    <div v-if="requireCompletion" class="alert-box alert-box--warning mb-6">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <div>
        <h4 class="font-bold">Complétez votre profil obligatoire</h4>
        <p>Afin de pouvoir commencer votre activité de mentor, vous devez impérativement renseigner votre profession, une présentation et votre parcours (CV).</p>
      </div>
    </div>

    <form @submit.prevent="saveProfile" class="profile-form">
      <!-- SECTION: Identité -->
      <div class="form-section">
        <h3 class="section-title">Identité & Photo de profil</h3>
        <div class="section-body">
          <div class="avatar-upload">
            <img v-if="form.avatarUrl" :src="form.avatarUrl" alt="Avatar" class="avatar-preview" />
            <div v-else class="avatar-placeholder">{{ form.name?.[0] }}</div>
            
            <div class="avatar-actions">
              <label class="btn btn--outline btn--sm" :class="{ 'is-loading': uploadingAvatar }">
                <input type="file" accept="image/*" class="hidden-input" @change="handleAvatarUpload" />
                {{ uploadingAvatar ? 'Upload en cours...' : 'Changer la photo' }}
              </label>
              <p class="help-text">Image recommandée : carré, max 2Mo.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nom complet</label>
              <input v-model="form.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Ville actuelle (France)</label>
              <input v-model="form.cityCurrentFr" type="text" class="form-input" placeholder="Ex: Paris" />
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION: Mentor -->
      <template v-if="isMentor">
        <div class="form-section">
          <h3 class="section-title">Informations Professionnelles</h3>
          <div class="section-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Profession actuelle *</label>
                <input v-model="form.currentProfession" type="text" class="form-input" placeholder="Ex: Développeur Senior, Chef de Projet..." required />
              </div>
              <div class="form-group">
                <label class="form-label">Lien LinkedIn *</label>
                <input v-model="form.linkedinUrl" type="url" class="form-input" placeholder="https://linkedin.com/in/..." required />
              </div>
              <div class="form-group">
                <label class="form-label">Années d'expérience *</label>
                <input v-model="form.yearsExperience" type="number" min="0" class="form-input" required />
              </div>
            </div>

            <div class="form-group mt-4">
              <label class="form-label">Centres d'intérêt / Domaines d'expertise</label>
              <input 
                type="text" 
                class="form-input" 
                placeholder="Ex: Tech, Management, Entrepreneuriat (séparés par des virgules)" 
                v-model="topicsInput"
                @blur="parseTopics"
              />
              <div class="tags-container mt-2">
                <span v-for="(topic, idx) in form.helpTopics" :key="idx" class="tag">
                  {{ topic }}
                  <button type="button" @click="form.helpTopics.splice(idx, 1)">&times;</button>
                </span>
              </div>
            </div>
            
            <div class="form-group mt-4">
              <label class="form-label">À propos de moi *</label>
              <p class="help-text mb-2">Décrivez votre parcours, vos passions et ce que vous souhaitez apporter en tant que mentor.</p>
              <textarea v-model="form.presentation" class="form-textarea" rows="5" required></textarea>
            </div>
          </div>
        </div>

        <!-- SECTION: Parcours / CV -->
        <div class="form-section">
          <div class="section-header-flex">
            <h3 class="section-title mb-0">Parcours (Expériences) *</h3>
            <button type="button" class="btn btn--outline btn--sm" @click="addExperience">+ Ajouter une expérience</button>
          </div>
          <div class="section-body">
            <p v-if="form.experiences.length === 0" class="help-text italic text-center py-4">
              Aucune expérience ajoutée. Il est obligatoire d'en ajouter au moins une (la plus récente).
            </p>

            <div v-for="(exp, idx) in form.experiences" :key="idx" class="experience-card">
              <div class="experience-card__header">
                <h4>Expérience {{ idx + 1 }}</h4>
                <button type="button" class="btn-remove" @click="form.experiences.splice(idx, 1)">Supprimer</button>
              </div>
              
              <div class="form-grid mt-3">
                <div class="form-group">
                  <label class="form-label">Titre du poste / Formation *</label>
                  <input v-model="exp.title" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Entreprise / École *</label>
                  <input v-model="exp.company" type="text" class="form-input" required />
                </div>
              </div>

              <div class="form-grid mt-3">
                <div class="form-group">
                  <label class="form-label">Date de début *</label>
                  <input v-model="exp.startDate" type="month" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Date de fin</label>
                  <input v-model="exp.endDate" type="month" class="form-input" :disabled="exp.current" />
                  <label class="checkbox-label mt-2">
                    <input
                      v-model="exp.current"
                      type="checkbox"
                      @change="handleCurrentExperienceChange(exp)"
                    />
                    C'est mon poste actuel
                  </label>
                </div>
              </div>

              <div class="form-group mt-3">
                <label class="form-label">Description (optionnel)</label>
                <textarea v-model="exp.description" class="form-textarea" rows="2"></textarea>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- SECTION: Étudiant / Mentoré -->
      <template v-else-if="user?.status && user.status !== 'mentor'">
        <div class="form-section">
          <h3 class="section-title">Mon Projet d'Études / d'Installation</h3>
          <div class="section-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Niveau d'études *</label>
                <select v-model="form.educationLevel" class="form-input" required>
                  <option value="" disabled>Sélectionnez un niveau</option>
                  <option value="Baccalauréat">Baccalauréat / Lycée</option>
                  <option value="Licence">Licence / Bachelor</option>
                  <option value="Master">Master / Ingénieur</option>
                  <option value="Doctorat">Doctorat</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">École ciblée ou actuelle</label>
                <input v-model="form.schoolName" type="text" class="form-input" placeholder="Ex: Sorbonne Université, INSA Lyon..." />
              </div>
              <div class="form-group">
                <label class="form-label">Date d'arrivée prévue ou réelle en France *</label>
                <input v-model="form.arrivalDate" type="month" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Villes ciblées en France</label>
                <input 
                  type="text" 
                  class="form-input" 
                  placeholder="Ex: Paris, Lyon, Toulouse (séparées par des virgules)" 
                  v-model="targetedCitiesInput"
                  @blur="parseTargetedCities"
                />
              </div>
            </div>

            <div class="form-group mt-4">
              <label class="form-label">Sur quels sujets avez-vous le plus besoin d'aide ? *</label>
              <div class="checkbox-group">
                <label class="checkbox-label"><input type="checkbox" v-model="form.needsHelp" value="Logement" /> Logement</label>
                <label class="checkbox-label"><input type="checkbox" v-model="form.needsHelp" value="Études" /> Études / Orientation</label>
                <label class="checkbox-label"><input type="checkbox" v-model="form.needsHelp" value="Emploi" /> Emploi / Alternance</label>
                <label class="checkbox-label"><input type="checkbox" v-model="form.needsHelp" value="Administratif" /> Démarches Administratives</label>
                <label class="checkbox-label"><input type="checkbox" v-model="form.needsHelp" value="Intégration" /> Intégration sociale</label>
              </div>
            </div>

            <div class="form-group mt-4">
              <label class="form-label">À propos de moi *</label>
              <p class="help-text mb-2">Présentez-vous brièvement et expliquez vos objectifs. Cela aidera nos mentors à mieux vous accompagner.</p>
              <textarea v-model="form.presentation" class="form-textarea" rows="4" required></textarea>
            </div>
          </div>
        </div>
      </template>

      <div class="form-actions">
        <button type="submit" class="btn btn--primary btn--lg" :disabled="isSaving" style="min-width: 200px">
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer le profil' }}
        </button>
      </div>
    </form>

    <!-- Modals -->
    <UiBaseModal v-model="showValidationModal" title="Information manquante">
      <p>Veuillez ajouter au moins une expérience professionnelle (votre parcours).</p>
      <template #footer>
        <button class="btn btn--primary" @click="showValidationModal = false">Compris</button>
      </template>
    </UiBaseModal>

    <UiBaseModal v-model="showSuccessModal" title="Succès">
      <p>Votre profil a été mis à jour avec succès.</p>
      <template #footer>
        <button class="btn btn--primary" @click="showSuccessModal = false">Fermer</button>
      </template>
    </UiBaseModal>

    <UiBaseModal v-model="showErrorModal" title="Erreur">
      <p>{{ errorMessage }}</p>
      <template #footer>
        <button class="btn btn--outline" @click="showErrorModal = false">Fermer</button>
      </template>
    </UiBaseModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Mon Profil' } as any)
const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const requireCompletion = computed(() => route.query.require_completion === '1')
const isMentor = computed(() => user.value?.status === 'mentor')

const isSaving = ref(false)
const uploadingAvatar = ref(false)
const topicsInput = ref('')
const targetedCitiesInput = ref('')

const showValidationModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  avatarUrl: '',
  cityCurrentFr: '',
  // Mentor specific
  currentProfession: '',
  presentation: '',
  linkedinUrl: '',
  yearsExperience: 0,
  helpTopics: [] as string[],
  experiences: [] as any[],
  
  // Student specific
  educationLevel: '',
  targetedCities: [] as string[],
  needsHelp: [] as string[],
  arrivalDate: '',
  schoolName: '',
})

// Fetch initial profile
const { data: response } = await useFetch<{ data: any }>('/api/user/profile')
if (response.value?.data) {
  const d = response.value.data
  form.name = d.name || ''
  form.avatarUrl = d.avatarUrl || ''
  form.cityCurrentFr = d.cityCurrentFr || ''
  
  if (d.mentorProfile) {
    const m = d.mentorProfile
    form.currentProfession = m.currentProfession || ''
    form.presentation = m.presentation || ''
    form.linkedinUrl = m.linkedinUrl || ''
    form.yearsExperience = m.yearsExperience || 0
    form.helpTopics = m.helpTopics || []
    form.experiences = m.experiences || []
    topicsInput.value = form.helpTopics.join(', ')
  }
  
  if (d.studentProfile) {
    const s = d.studentProfile
    form.educationLevel = s.educationLevel || ''
    form.targetedCities = s.targetedCities || []
    form.needsHelp = s.needsHelp || []
    form.arrivalDate = s.arrivalDate || ''
    form.schoolName = s.schoolName || ''
    form.presentation = s.presentation || form.presentation // reuse presentation field if it was set
    targetedCitiesInput.value = form.targetedCities.join(', ')
  }
}

function parseTopics() {
  if (!topicsInput.value) return
  const topics = topicsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  form.helpTopics = [...new Set([...form.helpTopics, ...topics])]
  topicsInput.value = form.helpTopics.join(', ')
}

function parseTargetedCities() {
  if (!targetedCitiesInput.value) {
    form.targetedCities = []
    return
  }
  const cities = targetedCitiesInput.value.split(',').map(c => c.trim()).filter(Boolean)
  form.targetedCities = [...new Set([...cities])]
  targetedCitiesInput.value = form.targetedCities.join(', ')
}

function handleCurrentExperienceChange(exp: { current: boolean; endDate: string }) {
  if (exp.current) {
    exp.endDate = ''
  }
}

function addExperience() {
  form.experiences.unshift({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })
}

async function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await $fetch<{ data: { url: string } }>('/api/upload/image?folder=avatars', {
      method: 'POST',
      body: formData,
    })
    form.avatarUrl = res.data.url
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors du téléchargement de l'image."
    showErrorModal.value = true
  } finally {
    uploadingAvatar.value = false
  }
}

async function saveProfile() {
  if (isMentor.value && form.experiences.length === 0) {
    showValidationModal.value = true
    return
  }

  isSaving.value = true
  try {
    await $fetch('/api/user/profile', {
      method: 'PATCH',
      body: form
    })
    
    if (requireCompletion.value) {
      router.push('/dashboard')
    } else {
      showSuccessModal.value = true
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Erreur lors de la sauvegarde.'
    showErrorModal.value = true
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.mb-6 { margin-bottom: var(--space-6); }
.mt-4 { margin-top: var(--space-4); }
.mt-3 { margin-top: var(--space-3); }
.mt-2 { margin-top: var(--space-2); }
.mb-0 { margin-bottom: 0 !important; }
.italic { font-style: italic; }
.text-center { text-align: center; }
.py-4 { padding-top: var(--space-4); padding-bottom: var(--space-4); }

.alert-box {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  background: white;
}
.alert-box--warning {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  color: #92400e;
}
.alert-box svg { flex-shrink: 0; color: #d97706; }

.form-section {
  background: white;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--neutral-200);
  margin-bottom: var(--space-8);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.section-title {
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--neutral-100);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--neutral-900);
  background: var(--neutral-50);
}

.section-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: var(--space-6);
  background: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-100);
}

.section-body {
  padding: var(--space-6);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--neutral-200);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--green-100);
  color: var(--green-700);
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
}

.hidden-input { display: none; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--text-sm); font-weight: 600; color: var(--neutral-700); }
.form-input, .form-textarea {
  width: 100%; padding: var(--space-3); font-size: var(--text-sm);
  border: 1px solid var(--neutral-200); border-radius: var(--radius-md);
  font-family: var(--font-sans); transition: border-color 0.2s;
}
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.form-textarea { resize: vertical; }
.form-input:disabled { background: var(--neutral-50); color: var(--neutral-400); }

.help-text { font-size: 12px; color: var(--neutral-500); }

.checkbox-label {
  display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--neutral-700); cursor: pointer;
}

.tags-container { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  background: var(--neutral-100); color: var(--neutral-700); font-size: 12px; font-weight: 500;
  padding: 4px 10px; border-radius: var(--radius-full); display: flex; align-items: center; gap: 6px;
}
.tag button { border: none; background: none; color: var(--neutral-500); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0; }
.tag button:hover { color: var(--red-500); }

/* Experience Cards */
.experience-card {
  background: var(--neutral-0); border: 1px solid var(--neutral-200); border-radius: var(--radius-xl);
  padding: var(--space-5); margin-bottom: var(--space-4); position: relative;
}
.experience-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); padding-bottom: var(--space-3); border-bottom: 1px dashed var(--neutral-200); }
.experience-card__header h4 { font-size: var(--text-sm); font-weight: 700; color: var(--neutral-900); }
.btn-remove { font-size: 12px; color: var(--red-500); border: none; background: none; cursor: pointer; }
.btn-remove:hover { text-decoration: underline; }

.form-actions { display: flex; justify-content: flex-end; margin-top: var(--space-8); }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
