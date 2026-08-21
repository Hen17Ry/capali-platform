<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/galleries" class="back-link">← Retour aux galeries</NuxtLink>
        <h1 class="admin-page-title">Créer une galerie</h1>
      </div>
    </div>

    <form class="event-form" @submit.prevent="submitGallery">
      <div class="form-grid">
        <div class="form-main">
          <div class="form-card">
            <h3 class="form-card__title">Détails de la galerie</h3>
            
            <div class="form-group">
              <label class="form-label">Événement Associé *</label>
              <select v-model="form.eventId" class="form-select" required>
                <option value="" disabled>Sélectionnez un événement</option>
                <option v-for="evt in events" :key="evt.id" :value="evt.id">
                  {{ evt.title }} ({{ new Date(evt.eventDate).toLocaleDateString('fr-FR') }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Description (Optionnel)</label>
              <textarea v-model="form.description" class="form-textarea" rows="4" placeholder="Quelques mots sur cette galerie..." />
            </div>
          </div>
          
          <div class="form-card mt-6">
            <h3 class="form-card__title">Images de la galerie *</h3>
            
            <div class="gallery-grid">
              <!-- Images prévisualisées -->
              <div v-for="(img, idx) in form.images" :key="idx" class="cover-preview">
                <img :src="img" />
                <button type="button" class="cover-preview__remove" title="Supprimer" @click="removeImage(idx)">✕</button>
              </div>

              <!-- Upload Button -->
              <label class="cover-upload-btn" :class="{ 'is-uploading': uploading }">
                <input type="file" ref="fileInput" multiple accept="image/*" style="display:none" @change="handleFileUpload" />
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  <svg v-if="!uploading" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg v-else class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span>{{ uploading ? 'Envoi...' : 'Ajouter des photos' }}</span>
                </div>
              </label>
            </div>
            <p class="text-xs text-muted" style="margin-top: 12px;">Vous pouvez sélectionner plusieurs images. Formats : JPG, PNG, WEBP.</p>
          </div>
        </div>

        <div class="form-sidebar">
          <div class="form-card">
            <h3 class="form-card__title">Publication</h3>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary btn--sm" style="width:100%" :disabled="loading || uploading || !form.eventId || form.images.length === 0">
                {{ loading ? 'Enregistrement...' : 'Créer la galerie' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const uploading = ref(false)

const form = reactive({ eventId: '', description: '', images: [] as string[] })

// Fetch events
const { data: eventsData } = await useFetch('/api/admin/events')
const events = computed(() => eventsData.value?.data || [])

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  uploading.value = true
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file) continue
      
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await $fetch<{ data: { url: string } }>('/api/upload/image?folder=galleries', { method: 'POST', body: formData })
      if (res.data?.url) form.images.push(res.data.url)
    }
  } catch (e: any) {
    alert("Erreur lors de l'upload: " + (e.data?.message || e.message))
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function removeImage(index: number) { form.images.splice(index, 1) }

async function submitGallery() {
  loading.value = true
  try {
    const res = await $fetch<{ success: boolean }>('/api/admin/galleries', { method: 'POST', body: form })
    if (res.success) {
      router.push('/admin/galleries')
      window.location.reload()
    }
  } catch (e: any) {
    alert("Erreur: " + (e.data?.message || e.message))
  } finally {
    loading.value = false
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
.form-textarea { resize: vertical; line-height: 1.6; }

/* Gallery grid */
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--space-4); }

.cover-preview { position: relative; aspect-ratio: 1; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--neutral-200); background: var(--neutral-50); }
.cover-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-preview__remove { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; border: none; transition: background 0.2s; opacity: 0; }
.cover-preview:hover .cover-preview__remove { opacity: 1; }
.cover-preview__remove:hover { background: rgba(239,68,68,0.9); }

.cover-upload-btn { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border: 2px dashed var(--neutral-200); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--neutral-500); cursor: pointer; transition: all 0.2s; }
.cover-upload-btn:hover { border-color: var(--green-400); color: var(--green-600); background: var(--green-50); }
.cover-upload-btn.is-uploading { pointer-events: none; opacity: 0.6; }

.mt-6 { margin-top: 1.5rem; }
.text-muted { color: var(--neutral-500); }
@media (max-width: 1024px) { .form-grid { grid-template-columns: 1fr; } .form-sidebar { position: static; } }
</style>
