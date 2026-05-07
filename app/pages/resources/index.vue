<template>
  <div class="resources-page">
    <section class="resources-hero">
      <div class="resources-hero__inner">
        <h1 class="resources-hero__title">Ressources <strong>CAP ALI</strong></h1>
        <p class="resources-hero__desc">Guides, articles et vidéos pour réussir votre parcours vers et en France</p>

        <!-- Search bar -->
        <div class="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            v-model="searchQuery"
            type="search"
            class="search-bar__input"
            placeholder="Rechercher une ressource..."
            @input="debouncedSearch"
          />
          <button v-if="searchQuery" class="search-bar__clear" @click="searchQuery = ''; fetchResources()">✕</button>
        </div>
      </div>
    </section>

    <div class="resources-layout">
      <!-- Filters sidebar -->
      <aside class="filters-sidebar">
        <div class="filter-section">
          <h3 class="filter-title">Thématique</h3>
          <button
            v-for="(label, key) in themeLabels" :key="key"
            class="filter-chip"
            :class="{ active: filters.theme === key }"
            @click="toggleFilter('theme', key)"
          >{{ label }}</button>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Type</h3>
          <button
            v-for="(label, key) in typeLabels" :key="key"
            class="filter-chip"
            :class="{ active: filters.type === key }"
            @click="toggleFilter('type', key)"
          >{{ label }}</button>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Niveau</h3>
          <button
            v-for="(label, key) in levelLabels" :key="key"
            class="filter-chip"
            :class="{ active: filters.level === key }"
            @click="toggleFilter('level', key)"
          >{{ label }}</button>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Pays</h3>
          <button
            v-for="(label, key) in countryLabels" :key="key"
            class="filter-chip"
            :class="{ active: filters.country === key }"
            @click="toggleFilter('country', key)"
          >{{ label }}</button>
        </div>

        <button v-if="hasActiveFilters" class="filter-clear" @click="clearFilters">
          Effacer les filtres
        </button>
      </aside>

      <!-- Resources grid -->
      <div class="resources-content">
        <!-- Active filters summary -->
        <div v-if="hasActiveFilters || searchQuery" class="active-filters">
          <span class="active-filters__count">{{ meta?.total ?? 0 }} résultat{{ (meta?.total ?? 0) !== 1 ? 's' : '' }}</span>
          <span v-if="searchQuery" class="active-filter-tag">
            🔍 « {{ searchQuery }} »
            <button @click="searchQuery = ''; fetchResources()">✕</button>
          </span>
          <span v-for="(val, key) in activeFilterTags" :key="key" class="active-filter-tag">
            {{ val }}
            <button @click="toggleFilter(key, '')">✕</button>
          </span>
        </div>

        <!-- Mobile filter toggle -->
        <button class="mobile-filter-btn" @click="showMobileFilters = !showMobileFilters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
          Filtres
        </button>

        <!-- Resources grid -->
        <div v-if="resourcesList.length" class="resources-grid">
          <NuxtLink
            v-for="r in resourcesList"
            :key="r.id"
            :to="`/resources/${r.id}`"
            class="resource-card"
          >
            <div class="resource-card__cover" :style="r.coverImage ? { backgroundImage: `url(${r.coverImage})` } : {}">
              <span v-if="!r.coverImage" class="resource-card__cover-placeholder">
                {{ themeEmojis[r.theme] || '📄' }}
              </span>
              <span class="resource-card__type-badge">{{ typeLabels[r.type] || r.type }}</span>
            </div>
            <div class="resource-card__body">
              <div class="resource-card__meta">
                <span class="resource-card__theme">{{ themeLabels[r.theme] || r.theme }}</span>
                <span class="resource-card__level">{{ levelLabels[r.targetLevel] || r.targetLevel }}</span>
              </div>
              <h3 class="resource-card__title">{{ r.title }}</h3>
              <p v-if="r.excerpt" class="resource-card__excerpt">{{ r.excerpt }}</p>
              <div class="resource-card__footer">
                <span class="resource-card__date">{{ formatDate(r.publishedAt) }}</span>
                <span v-if="r.sourcePlatform" class="resource-card__source">via {{ r.sourcePlatform }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-else class="resources-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <h3>Aucune ressource trouvée</h3>
          <p>Essayez de modifier vos filtres ou votre recherche.</p>
        </div>

        <!-- Pagination -->
        <div v-if="meta && meta.totalPages > 1" class="pagination">
          <button class="pagination__btn" :disabled="meta.page <= 1" @click="goToPage(meta.page - 1)">← Précédent</button>
          <span class="pagination__info">Page {{ meta.page }} / {{ meta.totalPages }}</span>
          <button class="pagination__btn" :disabled="meta.page >= meta.totalPages" @click="goToPage(meta.page + 1)">Suivant →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useHead({
  title: 'Ressources — CAP ALI',
  meta: [{ name: 'description', content: 'Guides, articles et vidéos pour réussir votre parcours en France — CAP ALI' }],
})

const themeLabels: Record<string, string> = {
  logement: '🏠 Logement',
  banque: '🏦 Banque & Finances',
  etudes: '🎓 Études',
  emploi: '💼 Emploi',
  vie_quotidienne: '🛒 Vie quotidienne',
  sante: '🏥 Santé',
  orientation: '🧭 Orientation',
  droits: '⚖️ Droits',
}

const themeEmojis: Record<string, string> = {
  logement: '🏠', banque: '🏦', etudes: '🎓', emploi: '💼',
  vie_quotidienne: '🛒', sante: '🏥', orientation: '🧭', droits: '⚖️',
}

const typeLabels: Record<string, string> = { article: '📄 Article', video: '🎥 Vidéo', webinar: '🎙️ Webinaire' }
const levelLabels: Record<string, string> = { predeparture: '✈️ Pré-départ', first_month: '🆕 Premier mois', installed: '🏡 Installé' }
const countryLabels: Record<string, string> = { benin: '🇧🇯 Bénin', france: '🇫🇷 France', both: '🌍 Les deux' }

const searchQuery = ref('')
const showMobileFilters = ref(false)
const currentPage = ref(1)
const filters = reactive({ theme: '', type: '', level: '', country: '' })

const queryParams = computed(() => {
  const params: Record<string, string | number> = { page: currentPage.value }
  if (searchQuery.value) params.q = searchQuery.value
  if (filters.theme) params.theme = filters.theme
  if (filters.type) params.type = filters.type
  if (filters.level) params.level = filters.level
  if (filters.country) params.country = filters.country
  return params
})

const { data: response, refresh: fetchResources } = await useFetch('/api/resources', {
  query: queryParams,
  watch: [queryParams],
})

const resourcesList = computed(() => response.value?.data ?? [])
const meta = computed(() => response.value?.meta)

const hasActiveFilters = computed(() => Object.values(filters).some(Boolean))

const activeFilterTags = computed(() => {
  const tags: Record<string, string> = {}
  if (filters.theme) tags.theme = themeLabels[filters.theme] || filters.theme
  if (filters.type) tags.type = typeLabels[filters.type] || filters.type
  if (filters.level) tags.level = levelLabels[filters.level] || filters.level
  if (filters.country) tags.country = countryLabels[filters.country] || filters.country
  return tags
})

function toggleFilter(key: string, value: string) {
  const k = key as keyof typeof filters
  filters[k] = filters[k] === value ? '' : value
  currentPage.value = 1
}

function clearFilters() {
  filters.theme = ''
  filters.type = ''
  filters.level = ''
  filters.country = ''
  currentPage.value = 1
}

function goToPage(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 400)
}

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
/* Hero */
.resources-hero { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 60px 24px 48px; text-align: center; }
.resources-hero__inner { max-width: 680px; margin: 0 auto; }
.resources-hero__title { font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 700; color: white; margin-bottom: var(--space-3); }
.resources-hero__title strong { color: #d4a843; }
.resources-hero__desc { color: rgba(255,255,255,0.7); font-size: var(--text-base); margin-bottom: var(--space-6); }

.search-bar { display: flex; align-items: center; gap: var(--space-3); background: white; border-radius: var(--radius-full); padding: 12px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 520px; margin: 0 auto; }
.search-bar svg { color: var(--neutral-400); flex-shrink: 0; }
.search-bar__input { flex: 1; border: none; outline: none; font-size: var(--text-sm); color: var(--neutral-800); background: transparent; }
.search-bar__clear { color: var(--neutral-400); font-size: 16px; cursor: pointer; border: none; background: none; }

/* Layout */
.resources-layout { display: grid; grid-template-columns: 260px 1fr; gap: var(--space-6); max-width: 1280px; margin: 0 auto; padding: var(--space-6) var(--space-5); }

/* Filters sidebar */
.filters-sidebar { position: sticky; top: 80px; }
.filter-section { margin-bottom: var(--space-5); }
.filter-title { font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--neutral-400); margin-bottom: var(--space-3); }
.filter-chip { display: block; width: 100%; text-align: left; padding: 8px 12px; font-size: var(--text-sm); color: var(--neutral-600); border: none; background: transparent; border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; }
.filter-chip:hover { background: var(--neutral-100); color: var(--neutral-900); }
.filter-chip.active { background: var(--green-50); color: var(--green-700); font-weight: 600; }
.filter-clear { font-size: var(--text-xs); color: var(--red-500); cursor: pointer; border: none; background: none; padding: 0; }
.filter-clear:hover { text-decoration: underline; }

/* Active filters */
.active-filters { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); margin-bottom: var(--space-4); }
.active-filters__count { font-size: var(--text-sm); font-weight: 600; color: var(--neutral-500); margin-right: var(--space-2); }
.active-filter-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; font-size: 12px; font-weight: 500; background: var(--green-50); color: var(--green-700); border-radius: var(--radius-full); }
.active-filter-tag button { color: var(--green-500); cursor: pointer; font-size: 14px; border: none; background: none; line-height: 1; }

/* Mobile filter */
.mobile-filter-btn { display: none; align-items: center; gap: var(--space-2); padding: 8px 16px; font-size: var(--text-sm); font-weight: 500; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-600); cursor: pointer; margin-bottom: var(--space-4); }

/* Grid */
.resources-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-5); }

/* Card */
.resource-card { background: var(--neutral-0); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--neutral-100); transition: all 0.25s ease; text-decoration: none; color: inherit; }
.resource-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: var(--green-200); }

.resource-card__cover { height: 180px; background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%); background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; }
.resource-card__cover-placeholder { font-size: 48px; opacity: 0.4; }
.resource-card__type-badge { position: absolute; top: 12px; right: 12px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); color: var(--neutral-700); }

.resource-card__body { padding: var(--space-5); }
.resource-card__meta { display: flex; gap: var(--space-2); margin-bottom: var(--space-3); }
.resource-card__theme { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: var(--radius-full); background: var(--green-50); color: var(--green-700); }
.resource-card__level { font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: var(--radius-full); background: #fef3c7; color: #92400e; }
.resource-card__title { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-2); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.resource-card__excerpt { font-size: var(--text-sm); color: var(--neutral-500); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: var(--space-3); }
.resource-card__footer { display: flex; justify-content: space-between; align-items: center; }
.resource-card__date { font-size: var(--text-xs); color: var(--neutral-400); }
.resource-card__source { font-size: var(--text-xs); color: var(--neutral-400); font-style: italic; }

/* Empty */
.resources-empty { text-align: center; padding: var(--space-16) var(--space-6); color: var(--neutral-400); }
.resources-empty svg { margin: 0 auto var(--space-4); }
.resources-empty h3 { font-size: var(--text-lg); font-weight: 600; color: var(--neutral-600); margin-bottom: var(--space-2); }
.resources-empty p { font-size: var(--text-sm); }

/* Pagination */
.pagination { display: flex; align-items: center; justify-content: center; gap: var(--space-4); margin-top: var(--space-8); }
.pagination__btn { padding: 8px 16px; font-size: var(--text-sm); font-weight: 500; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-700); cursor: pointer; transition: all 0.2s; }
.pagination__btn:hover:not(:disabled) { border-color: var(--green-400); color: var(--green-600); }
.pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination__info { font-size: var(--text-sm); color: var(--neutral-500); }

@media (max-width: 768px) {
  .resources-layout { grid-template-columns: 1fr; }
  .filters-sidebar { display: none; }
  .mobile-filter-btn { display: flex; }
  .resources-grid { grid-template-columns: 1fr; }
  .resources-hero { padding: 40px 16px 32px; }
  .resources-hero__title { font-size: var(--text-2xl); }
}
</style>
