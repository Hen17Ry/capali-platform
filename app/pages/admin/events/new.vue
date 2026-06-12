<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/events" class="back-link">← Retour aux événements</NuxtLink>
        <h1 class="admin-page-title">{{ isEdit ? 'Modifier l\'événement' : 'Nouvel événement' }}</h1>
      </div>
    </div>

    <form class="event-form" @submit.prevent="submitForm">
      <div class="form-grid">
        <div class="form-main">
          <div class="form-card">
            <div class="form-group">
              <label class="form-label">Titre *</label>
              <input v-model="form.title" type="text" class="form-input form-input--lg" placeholder="Titre de l'événement" required >
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea v-model="form.description" class="form-textarea" rows="8" placeholder="Description détaillée de l'événement..." />
            </div>
          </div>
        </div>

        <div class="form-sidebar">
          <div class="form-card">
            <h3 class="form-card__title">Publication</h3>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary btn--sm" style="width:100%" :disabled="submitting">
                {{ submitting ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer l\'événement') }}
              </button>
            </div>
          </div>

          <!-- Cover image -->
          <div class="form-card">
            <h3 class="form-card__title">Image représentative</h3>
            <div v-if="form.coverImage" class="cover-preview">
              <img :src="form.coverImage" alt="Couverture de l'événement" >
              <button type="button" class="cover-preview__remove" title="Supprimer" @click="form.coverImage = ''">✕</button>
            </div>
            <label class="cover-upload-btn" :class="{ 'is-uploading': coverUploading }">
              <input type="file" accept="image/*" style="display:none" @change="uploadCover" >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              {{ coverUploading ? 'Upload...' : (form.coverImage ? 'Changer l\'image' : 'Ajouter une image') }}
            </label>
          </div>

          <div class="form-card">
            <h3 class="form-card__title">Détails</h3>
            <div class="form-group">
              <label class="form-label">Lieu / Type *</label>
              <select v-model="form.type" class="form-select" required>
                <option value="france">🇫🇷 France</option>
                <option value="benin">🇧🇯 Bénin</option>
                <option value="online">🌐 En ligne</option>
              </select>
            </div>
            <div v-if="form.type !== 'online'" class="form-group">
              <label class="form-label">Ville</label>
              <input v-model="form.city" type="text" class="form-input" placeholder="Ex: Paris, Cotonou..." >
            </div>
            <div class="form-group">
              <label class="form-label">Date et heure *</label>
              <input v-model="form.eventDate" type="datetime-local" class="form-input" required >
            </div>
            <div class="form-group">
              <label class="form-label">Lien d'inscription (externe)</label>
              <input v-model="form.registrationUrl" type="url" class="form-input" placeholder="https://..." >
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

const submitting = ref(false)
const coverUploading = ref(false)

const form = reactive({
  title: '',
  description: '',
  coverImage: '',
  type: 'online',
  city: '',
  eventDate: '',
  registrationUrl: '',
})

interface EventData {
  title?: string
  description?: string
  coverImage?: string
  type?: string
  city?: string
  eventDate?: string
  registrationUrl?: string
}

if (isEdit.value) {
  const { data } = await useFetch(`/api/admin/events/${route.params.id}`)
  if (data.value?.data) {
    const d = data.value.data as EventData
    Object.assign(form, {
      title: d.title || '',
      description: d.description || '',
      coverImage: d.coverImage || '',
      type: d.type || 'online',
      city: d.city || '',
      eventDate: d.eventDate ? new Date(d.eventDate).toISOString().slice(0, 16) : '',
      registrationUrl: d.registrationUrl || '',
    })
  }
}

// ── Cover image upload ──
async function uploadCover(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  coverUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await $fetch<{ data: { url: string } }>('/api/upload/image?folder=events', {
      method: 'POST',
      body: formData,
    })
    form.coverImage = response.data.url
  } catch (err) {
    const error = err as { data?: { message?: string } }
    alert(error?.data?.message || 'Erreur lors de l\'upload.')
  } finally {
    coverUploading.value = false
  }
}

async function submitForm() {
  submitting.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/admin/events/${route.params.id}`, { method: 'PATCH', body: form })
    } else {
      await $fetch('/api/admin/events', { method: 'POST', body: form })
    }
    router.push('/admin/events')
  } catch (e) {
    const error = e as { data?: { statusMessage?: string; message?: string } }
    alert(error?.data?.statusMessage || error?.data?.message || 'Erreur lors de la sauvegarde.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); }
.back-link { font-size: var(--text-sm); color: var(--neutral-500); display: inline-block; margin-bottom: var(--space-2); }
.back-link:hover { color: var(--green-600); }

/* Form grid */
.form-grid { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-6); align-items: flex-start; }
.form-main { display: flex; flex-direction: column; gap: var(--space-4); }
.form-sidebar { display: flex; flex-direction: column; gap: var(--space-4); position: sticky; top: 80px; }

.form-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); }
.form-card__title { font-size: var(--text-sm); font-weight: 600; color: var(--neutral-900); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--neutral-100); }

.form-group { margin-bottom: var(--space-4); }
.form-label { display: block; font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); margin-bottom: var(--space-2); }

.form-input, .form-select, .form-textarea { width: 100%; padding: var(--space-3); font-size: var(--text-sm); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-800); font-family: var(--font-sans); transition: border-color var(--transition-fast); }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.form-input--lg { font-size: var(--text-lg); font-weight: 600; padding: var(--space-4); }
.form-textarea { resize: vertical; line-height: 1.6; }

/* Cover image */
.cover-preview { position: relative; margin-bottom: var(--space-3); border-radius: var(--radius-lg); overflow: hidden; }
.cover-preview img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
.cover-preview__remove { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; border: none; transition: background 0.2s; }
.cover-preview__remove:hover { background: rgba(239,68,68,0.8); }

.cover-upload-btn { display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-3); border: 2px dashed var(--neutral-200); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--neutral-500); cursor: pointer; transition: all 0.2s; }
.cover-upload-btn:hover { border-color: var(--green-400); color: var(--green-600); background: var(--green-50); }
.cover-upload-btn.is-uploading { pointer-events: none; opacity: 0.6; }

@media (max-width: 1024px) { .form-grid { grid-template-columns: 1fr; } .form-sidebar { position: static; } }
</style>
