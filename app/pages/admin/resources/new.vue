<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/resources" class="back-link">← Retour aux ressources</NuxtLink>
        <h1 class="admin-page-title">{{ isEdit ? 'Modifier la ressource' : 'Nouvelle ressource' }}</h1>
      </div>
    </div>

    <form class="resource-form" @submit.prevent="submitForm">
      <div class="form-grid">
        <div class="form-main">
          <div class="form-group">
            <label class="form-label">Titre *</label>
            <input v-model="form.title" type="text" class="form-input" placeholder="Titre de la ressource" required />
          </div>

          <div class="form-group">
            <label class="form-label">Contenu *</label>
            <textarea v-model="form.content" class="form-textarea" rows="16" placeholder="Contenu de la ressource (Markdown supporté)" required />
          </div>
        </div>

        <div class="form-sidebar">
          <div class="form-card">
            <h3 class="form-card__title">Publication</h3>
            <div class="form-group">
              <label class="form-toggle">
                <input v-model="form.isDraft" type="checkbox" />
                <span>Brouillon</span>
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary btn--sm" style="width:100%">{{ isEdit ? 'Mettre à jour' : 'Créer' }}</button>
            </div>
          </div>

          <div class="form-card">
            <h3 class="form-card__title">Métadonnées</h3>
            <div class="form-group">
              <label class="form-label">Type *</label>
              <select v-model="form.type" class="form-select">
                <option value="article">Article</option>
                <option value="video">Vidéo</option>
                <option value="webinar">Webinaire</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Thème *</label>
              <select v-model="form.theme" class="form-select" required>
                <option value="">Choisir...</option>
                <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Niveau cible *</label>
              <select v-model="form.targetLevel" class="form-select" required>
                <option value="predeparture">Pré-départ</option>
                <option value="first_month">Premier mois</option>
                <option value="installed">Installé</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Pays cible</label>
              <select v-model="form.targetCountry" class="form-select">
                <option value="both">Bénin et France</option>
                <option value="benin">Bénin</option>
                <option value="france">France</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const themes = ['logement', 'banque', 'études', 'emploi', 'vie-quotidienne', 'santé', 'orientation', 'droits']

const form = reactive({
  title: '',
  content: '',
  type: 'article',
  theme: '',
  targetLevel: 'predeparture',
  targetCountry: 'both',
  isDraft: true,
})

// Load existing resource for edit mode
if (isEdit.value) {
  const { data } = await useFetch(`/api/admin/resources/${route.params.id}`)
  if (data.value?.data) {
    Object.assign(form, data.value.data)
  }
}

async function submitForm() {
  try {
    if (isEdit.value) {
      await $fetch(`/api/admin/resources/${route.params.id}`, { method: 'PATCH', body: form })
    } else {
      await $fetch('/api/admin/resources', { method: 'POST', body: form })
    }
    router.push('/admin/resources')
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Erreur lors de la sauvegarde.')
  }
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); }
.back-link { font-size: var(--text-sm); color: var(--neutral-500); display: inline-block; margin-bottom: var(--space-2); }
.back-link:hover { color: var(--green-600); }

.form-grid { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-6); align-items: flex-start; }

.form-main { display: flex; flex-direction: column; gap: var(--space-4); }

.form-sidebar { display: flex; flex-direction: column; gap: var(--space-4); }

.form-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--neutral-100); }
.form-card__title { font-size: var(--text-sm); font-weight: 600; color: var(--neutral-900); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--neutral-100); }

.form-group { margin-bottom: var(--space-4); }
.form-label { display: block; font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); margin-bottom: var(--space-2); }

.form-input, .form-select, .form-textarea { width: 100%; padding: var(--space-3); font-size: var(--text-sm); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-800); font-family: var(--font-sans); transition: border-color var(--transition-fast); }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.form-textarea { resize: vertical; min-height: 200px; line-height: 1.6; }

.form-toggle { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); cursor: pointer; color: var(--neutral-700); }
.form-toggle input { accent-color: var(--green-500); }

.form-actions { margin-top: var(--space-4); }

@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
</style>
