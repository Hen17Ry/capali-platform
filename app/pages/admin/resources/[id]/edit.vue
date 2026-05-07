<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/resources" class="back-link">← Retour aux ressources</NuxtLink>
        <h1 class="admin-page-title">{{ isEdit ? 'Modifier la ressource' : 'Nouvelle ressource' }}</h1>
      </div>
    </div>

    <!-- Social import bar -->
    <div v-if="!isEdit" class="import-bar">
      <div class="import-bar__inner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <input
          v-model="importUrl"
          type="url"
          class="import-bar__input"
          placeholder="Coller un lien Instagram, LinkedIn, TikTok, YouTube..."
          @keydown.enter.prevent="importFromUrl"
        />
        <button type="button" class="btn btn--primary btn--sm" :disabled="importLoading || !importUrl" @click="importFromUrl">
          <span v-if="importLoading" class="btn-spinner" />
          {{ importLoading ? 'Import...' : 'Importer' }}
        </button>
      </div>
      <p v-if="importError" class="import-bar__error">{{ importError }}</p>
      <p v-if="importSuccess" class="import-bar__success">✅ Contenu importé ! Vérifiez et complétez les champs ci-dessous.</p>
    </div>

    <form class="resource-form" @submit.prevent="submitForm">
      <div class="form-grid">
        <!-- Main content -->
        <div class="form-main">
          <div class="form-group">
            <label class="form-label">Titre *</label>
            <input v-model="form.title" type="text" class="form-input form-input--lg" placeholder="Titre de la ressource" required />
          </div>

          <div class="form-group">
            <label class="form-label">Résumé</label>
            <textarea v-model="form.excerpt" class="form-textarea form-textarea--sm" rows="3" maxlength="500" placeholder="Court résumé affiché dans les cartes (max 500 car.)"></textarea>
            <span class="form-hint">{{ (form.excerpt || '').length }}/500</span>
          </div>

          <!-- Tabs: Edit / Preview -->
          <div class="editor-tabs">
            <button type="button" class="editor-tab" :class="{ active: activeTab === 'edit' }" @click="activeTab = 'edit'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Édition
            </button>
            <button type="button" class="editor-tab" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Aperçu
            </button>
          </div>

          <div v-show="activeTab === 'edit'" class="form-group">
            <ClientOnly>
              <AdminRichEditor v-model="form.content" placeholder="Rédigez votre ressource..." />
            </ClientOnly>
          </div>

          <div v-if="activeTab === 'preview'" class="preview-pane">
            <div v-if="form.coverImage" class="preview-cover">
              <img :src="form.coverImage" :alt="form.title" />
            </div>
            <h1 class="preview-title">{{ form.title || 'Titre de la ressource' }}</h1>
            <p v-if="form.excerpt" class="preview-excerpt">{{ form.excerpt }}</p>
            <div class="preview-meta">
              <span class="preview-badge">{{ themeLabels[form.theme] || form.theme }}</span>
              <span class="preview-badge preview-badge--type">{{ typeLabels[form.type] || form.type }}</span>
              <span class="preview-badge preview-badge--level">{{ levelLabels[form.targetLevel] || form.targetLevel }}</span>
            </div>
            <hr class="preview-divider" />
            <div class="preview-content" v-html="form.content || '<p style=&quot;color:#94a3b8&quot;>Aucun contenu pour l\'instant.</p>'" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="form-sidebar">
          <!-- Publication -->
          <div class="form-card">
            <h3 class="form-card__title">Publication</h3>
            <div class="form-group">
              <label class="form-toggle">
                <input v-model="form.isDraft" type="checkbox" />
                <span>Brouillon</span>
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary btn--sm" style="width:100%;" :disabled="submitting">
                {{ submitting ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
              </button>
            </div>
          </div>

          <!-- Cover image -->
          <div class="form-card">
            <h3 class="form-card__title">Image de couverture</h3>
            <div v-if="form.coverImage" class="cover-preview">
              <img :src="form.coverImage" alt="Couverture" />
              <button type="button" class="cover-preview__remove" @click="form.coverImage = ''" title="Supprimer">✕</button>
            </div>
            <label class="cover-upload-btn" :class="{ 'is-uploading': coverUploading }">
              <input type="file" accept="image/*" style="display:none" @change="uploadCover" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              {{ coverUploading ? 'Upload...' : (form.coverImage ? 'Changer' : 'Ajouter une image') }}
            </label>
          </div>

          <!-- Metadata -->
          <div class="form-card">
            <h3 class="form-card__title">Métadonnées</h3>
            <div class="form-group">
              <label class="form-label">Type *</label>
              <select v-model="form.type" class="form-select">
                <option value="article">📄 Article</option>
                <option value="video">🎥 Vidéo</option>
                <option value="webinar">🎙️ Webinaire</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Thème *</label>
              <select v-model="form.theme" class="form-select" required>
                <option value="">Choisir...</option>
                <option v-for="(label, key) in themeLabels" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Niveau cible *</label>
              <select v-model="form.targetLevel" class="form-select" required>
                <option v-for="(label, key) in levelLabels" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Pays cible</label>
              <select v-model="form.targetCountry" class="form-select">
                <option value="both">🌍 Bénin et France</option>
                <option value="benin">🇧🇯 Bénin</option>
                <option value="france">🇫🇷 France</option>
              </select>
            </div>
          </div>

          <!-- Source info (if imported) -->
          <div v-if="form.sourceUrl" class="form-card">
            <h3 class="form-card__title">Source importée</h3>
            <p class="source-info">
              <span class="source-platform">{{ form.sourcePlatform || 'Web' }}</span>
              <a :href="form.sourceUrl" target="_blank" rel="noopener" class="source-link">Voir l'original →</a>
            </p>
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

const activeTab = ref('edit')
const submitting = ref(false)
const coverUploading = ref(false)
const importUrl = ref('')
const importLoading = ref(false)
const importError = ref('')
const importSuccess = ref(false)

const themeLabels: Record<string, string> = {
  logement: '🏠 Logement',
  banque: '🏦 Banque & Finances',
  etudes: '🎓 Études & Université',
  emploi: '💼 Emploi & Alternance',
  vie_quotidienne: '🛒 Vie quotidienne',
  sante: '🏥 Santé',
  orientation: '🧭 Orientation pré-départ',
  droits: '⚖️ Droits & Administratif',
}

const typeLabels: Record<string, string> = {
  article: '📄 Article',
  video: '🎥 Vidéo',
  webinar: '🎙️ Webinaire',
}

const levelLabels: Record<string, string> = {
  predeparture: '✈️ Pré-départ',
  first_month: '🆕 Premier mois',
  installed: '🏡 Installé (+6 mois)',
}

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  type: 'article',
  theme: '',
  targetLevel: 'predeparture',
  targetCountry: 'both',
  isDraft: true,
  sourceUrl: '',
  sourcePlatform: '',
})

// Load existing resource for edit mode
if (isEdit.value) {
  const { data } = await useFetch<{ data: any }>(`/api/admin/resources/${route.params.id}`)
  if (data.value?.data) {
    Object.assign(form, data.value.data)
  }
}

// ── Import from social link ──
async function importFromUrl() {
  if (!importUrl.value) return
  importLoading.value = true
  importError.value = ''
  importSuccess.value = false

  try {
    const result = await $fetch<{ data: any }>('/api/admin/resources/scrape', {
      method: 'POST',
      body: { url: importUrl.value },
    })
    const scraped = result.data

    // Pre-fill form with scraped data
    if (scraped.title) form.title = scraped.title
    if (scraped.description) form.excerpt = scraped.description.slice(0, 500)
    if (scraped.content) form.content = scraped.content
    if (scraped.image) form.coverImage = scraped.image
    if (scraped.platform) form.sourcePlatform = scraped.platform
    if (scraped.type) form.type = scraped.type
    form.sourceUrl = importUrl.value

    importSuccess.value = true
  } catch (err: any) {
    importError.value = err?.data?.message || 'Impossible d\'importer ce lien.'
  } finally {
    importLoading.value = false
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
    const response = await $fetch<{ data: { url: string } }>('/api/upload/image?folder=covers', {
      method: 'POST',
      body: formData,
    })
    form.coverImage = response.data.url
  } catch (err: any) {
    alert(err?.data?.message || 'Erreur lors de l\'upload.')
  } finally {
    coverUploading.value = false
  }
}

// ── Submit form ──
async function submitForm() {
  submitting.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/admin/resources/${route.params.id}`, { method: 'PATCH', body: form })
    } else {
      await $fetch('/api/admin/resources', { method: 'POST', body: form })
    }
    router.push('/admin/resources')
  } catch (e: any) {
    alert(e?.data?.message || e?.data?.statusMessage || 'Erreur lors de la sauvegarde.')
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

/* Import bar */
.import-bar { background: var(--neutral-0); border: 2px dashed var(--neutral-200); border-radius: var(--radius-xl); padding: var(--space-5); margin-bottom: var(--space-6); transition: border-color 0.2s; }
.import-bar:focus-within { border-color: var(--green-400); }
.import-bar__inner { display: flex; align-items: center; gap: var(--space-3); }
.import-bar__inner svg { color: var(--neutral-400); flex-shrink: 0; }
.import-bar__input { flex: 1; border: none; outline: none; font-size: var(--text-sm); color: var(--neutral-800); background: transparent; }
.import-bar__input::placeholder { color: var(--neutral-400); }
.import-bar__error { margin-top: var(--space-2); font-size: var(--text-xs); color: var(--red-500); }
.import-bar__success { margin-top: var(--space-2); font-size: var(--text-xs); color: var(--green-600); }
.btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 6px; }

/* Form grid */
.form-grid { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-6); align-items: flex-start; }
.form-main { display: flex; flex-direction: column; gap: var(--space-4); }
.form-sidebar { display: flex; flex-direction: column; gap: var(--space-4); position: sticky; top: 80px; }

.form-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--neutral-100); }
.form-card__title { font-size: var(--text-sm); font-weight: 600; color: var(--neutral-900); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--neutral-100); }

.form-group { margin-bottom: var(--space-4); }
.form-label { display: block; font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); margin-bottom: var(--space-2); }
.form-hint { font-size: 11px; color: var(--neutral-400); margin-top: 4px; display: block; text-align: right; }

.form-input, .form-select, .form-textarea { width: 100%; padding: var(--space-3); font-size: var(--text-sm); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-800); font-family: var(--font-sans); transition: border-color var(--transition-fast); }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.form-input--lg { font-size: var(--text-lg); font-weight: 600; padding: var(--space-4); }
.form-textarea { resize: vertical; line-height: 1.6; }
.form-textarea--sm { min-height: 80px; }

.form-toggle { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); cursor: pointer; color: var(--neutral-700); }
.form-toggle input { accent-color: var(--green-500); }
.form-actions { margin-top: var(--space-4); }

/* Editor tabs */
.editor-tabs { display: flex; gap: 4px; background: var(--neutral-100); padding: 4px; border-radius: var(--radius-lg); }
.editor-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 16px; font-size: var(--text-sm); font-weight: 500; color: var(--neutral-500); border-radius: var(--radius-md); transition: all 0.2s; cursor: pointer; border: none; background: transparent; }
.editor-tab.active { background: var(--neutral-0); color: var(--neutral-900); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.editor-tab:hover:not(.active) { color: var(--neutral-700); }

/* Cover image */
.cover-preview { position: relative; margin-bottom: var(--space-3); border-radius: var(--radius-lg); overflow: hidden; }
.cover-preview img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
.cover-preview__remove { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; border: none; transition: background 0.2s; }
.cover-preview__remove:hover { background: rgba(239,68,68,0.8); }

.cover-upload-btn { display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-3); border: 2px dashed var(--neutral-200); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--neutral-500); cursor: pointer; transition: all 0.2s; }
.cover-upload-btn:hover { border-color: var(--green-400); color: var(--green-600); background: var(--green-50); }
.cover-upload-btn.is-uploading { pointer-events: none; opacity: 0.6; }

/* Source info */
.source-info { display: flex; flex-direction: column; gap: 4px; }
.source-platform { font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--neutral-400); }
.source-link { font-size: var(--text-sm); color: var(--green-600); }
.source-link:hover { text-decoration: underline; }

/* Preview pane */
.preview-pane { background: var(--neutral-0); border: 1px solid var(--neutral-100); border-radius: var(--radius-xl); padding: var(--space-8); }
.preview-cover { margin: calc(-1 * var(--space-8)); margin-bottom: var(--space-6); }
.preview-cover img { width: 100%; max-height: 360px; object-fit: cover; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
.preview-title { font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-3); }
.preview-excerpt { font-size: var(--text-base); color: var(--neutral-500); margin-bottom: var(--space-4); line-height: 1.6; }
.preview-meta { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4); }
.preview-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); background: var(--green-50); color: var(--green-700); }
.preview-badge--type { background: #eff6ff; color: #3b82f6; }
.preview-badge--level { background: #fef3c7; color: #92400e; }
.preview-divider { border: none; border-top: 1px solid var(--neutral-100); margin: var(--space-6) 0; }
.preview-content { font-size: 15px; line-height: 1.75; color: var(--neutral-700); }
.preview-content :deep(h2) { font-family: var(--font-serif); font-size: 1.5em; font-weight: 700; margin: 1em 0 0.5em; color: var(--neutral-900); }
.preview-content :deep(h3) { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.4em; }
.preview-content :deep(img) { max-width: 100%; border-radius: var(--radius-lg); margin: 1em 0; }
.preview-content :deep(a) { color: var(--green-600); }
.preview-content :deep(blockquote) { border-left: 4px solid var(--green-300); padding: 0.5em 1em; margin: 1em 0; background: var(--green-50); border-radius: 0 var(--radius-md) var(--radius-md) 0; }

@media (max-width: 1024px) { .form-grid { grid-template-columns: 1fr; } .form-sidebar { position: static; } }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
