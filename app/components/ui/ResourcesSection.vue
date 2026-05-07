<template>
  <section id="resources" class="section section--cream resources">
    <div class="container">
      <div class="resources__header reveal">
        <span class="section__overtitle">{{ $t('resources.overtitle') }}</span>
        <h2 class="section__title">{{ $t('resources.title') }}</h2>
        <p class="section__description">{{ $t('resources.description') }}</p>
      </div>

      <!-- Themes grid -->
      <div class="resources__themes reveal-stagger">
        <div v-for="(theme, i) in themes" :key="i" class="resources__theme-card">
          <div class="resources__theme-icon" v-html="theme.icon" />
          <span class="resources__theme-name">{{ $t(theme.label) }}</span>
        </div>
      </div>

      <!-- Latest resources -->
      <div v-if="pending" class="resources__loading">
        Chargement des ressources...
      </div>
      <div v-else-if="resourcesList && resourcesList.length > 0" class="resources__latest reveal">
        <h3 class="resources__latest-title">Dernières ressources</h3>
        <div class="resources-grid">
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
            </div>
          </NuxtLink>
        </div>
        <div class="resources__more">
          <NuxtLink to="/resources" class="btn btn--secondary">
            Voir toutes les ressources
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Empty state (only if no resources exist) -->
      <div v-else class="resources__empty reveal">
        <div class="resources__empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <p>{{ $t('resources.empty') }}</p>
        <NuxtLink to="/resources" class="btn btn--primary">{{ $t('resources.cta') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Fetch the latest 3 resources
const { data: response, pending } = await useFetch<{ data: any[] }>('/api/resources?perPage=3')
const resourcesList = computed(() => response.value?.data || [])

const themes = [
  { label: 'resources.theme_housing', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { label: 'resources.theme_bank', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { label: 'resources.theme_studies', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>' },
  { label: 'resources.theme_employment', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
  { label: 'resources.theme_daily', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { label: 'resources.theme_health', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
  { label: 'resources.theme_orientation', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>' },
  { label: 'resources.theme_rights', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
]

// Labels for cards
const themeLabels: Record<string, string> = {
  logement: '🏠 Logement', banque: '🏦 Banque & Finances', etudes: '🎓 Études', emploi: '💼 Emploi',
  vie_quotidienne: '🛒 Vie quotidienne', sante: '🏥 Santé', orientation: '🧭 Orientation', droits: '⚖️ Droits',
}
const themeEmojis: Record<string, string> = {
  logement: '🏠', banque: '🏦', etudes: '🎓', emploi: '💼',
  vie_quotidienne: '🛒', sante: '🏥', orientation: '🧭', droits: '⚖️',
}
const typeLabels: Record<string, string> = { article: '📄 Article', video: '🎥 Vidéo', webinar: '🎙️ Webinaire' }
const levelLabels: Record<string, string> = { predeparture: '✈️ Pré-départ', first_month: '🆕 Premier mois', installed: '🏡 Installé' }
</script>

<style scoped>
.resources__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-12);
}

.resources__header .section__overtitle::before {
  display: none;
}

.resources__themes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.resources__theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  transition: all var(--transition-base);
  cursor: default;
}

.resources__theme-card:hover {
  border-color: var(--green-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.resources__theme-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--green-50);
  color: var(--green-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.resources__theme-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-700);
  text-align: center;
}

/* Latest Resources grid */
.resources__loading {
  text-align: center;
  color: var(--neutral-500);
  padding: var(--space-8);
}

.resources__latest-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-6);
  text-align: center;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.resource-card {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--neutral-200);
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}
.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  border-color: var(--green-200);
}

.resource-card__cover {
  height: 180px;
  background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resource-card__cover-placeholder { font-size: 48px; opacity: 0.4; }
.resource-card__type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  color: var(--neutral-700);
}

.resource-card__body { padding: var(--space-5); flex: 1; }
.resource-card__meta { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-3); }
.resource-card__theme { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: var(--radius-full); background: var(--green-50); color: var(--green-700); }
.resource-card__level { font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: var(--radius-full); background: #fef3c7; color: #92400e; }
.resource-card__title {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-2);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.resource-card__excerpt {
  font-size: var(--text-sm);
  color: var(--neutral-500);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resources__more {
  text-align: center;
}

/* Empty state */
.resources__empty {
  text-align: center;
  padding: var(--space-12) var(--space-8);
  background: var(--neutral-0);
  border-radius: var(--radius-2xl);
  border: 2px dashed var(--neutral-200);
}

.resources__empty-icon {
  color: var(--neutral-300);
  margin-bottom: var(--space-4);
}

.resources__empty p {
  color: var(--neutral-500);
  font-size: var(--text-base);
  margin-bottom: var(--space-6);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 1024px) {
  .resources-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .resources__themes { grid-template-columns: repeat(2, 1fr); }
  .resources-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .resources__themes { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
  .resources__theme-card { padding: var(--space-4); }
}
</style>
