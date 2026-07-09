<template>
  <div class="resource-detail-page">
    <!-- Breadcrumb & Header -->
    <div class="resource-header">
      <div class="container">
        <NuxtLink to="/resources" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour aux ressources
        </NuxtLink>

        <div v-if="pending" class="resource-loading">Chargement...</div>
        <div v-else-if="error" class="resource-error">
          Impossible de charger cette ressource. Elle a peut-être été supprimée ou rendue privée.
        </div>
        <template v-else-if="resource">
          <div class="resource-meta">
            <span class="resource-badge">{{ themeLabels[resource.theme] || resource.theme }}</span>
            <span class="resource-badge resource-badge--type">{{ typeLabels[resource.type] || resource.type }}</span>
            <span class="resource-badge resource-badge--level">{{ levelLabels[resource.targetLevel] || resource.targetLevel }}</span>
          </div>

          <h1 class="resource-title">{{ resource.title }}</h1>
          
          <div class="resource-author-date">
            <div v-if="resource.authorName" class="resource-author">
              <img v-if="resource.authorAvatar" :src="resource.authorAvatar" :alt="resource.authorName" class="author-avatar" >
              <div v-else class="author-avatar author-avatar--placeholder">{{ resource.authorName[0] }}</div>
              <span>Par {{ resource.authorName }}</span>
            </div>
            <span class="resource-date">Publié le {{ formatDate(resource.publishedAt || resource.createdAt) }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="resource" class="container resource-body-container">
      <!-- Sidebar / Quick info -->
      <aside class="resource-sidebar">
        <div v-if="resource.sourceUrl" class="sidebar-card">
          <h3 class="sidebar-title">Ressource externe</h3>
          <p class="sidebar-text">Cette ressource provient de <strong>{{ resource.sourcePlatform || 'une source externe' }}</strong>.</p>
          <a :href="resource.sourceUrl" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm sidebar-btn">
            Voir l'original sur {{ resource.sourcePlatform || 'le site' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>

        <div class="sidebar-card share-card">
          <h3 class="sidebar-title">Partager</h3>
          <div class="share-buttons">
            <button class="share-btn" title="Copier le lien" @click="copyLink">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <a :href="`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`" target="_blank" class="share-btn" title="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"/></svg>
            </a>
            <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`" target="_blank" class="share-btn" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <article class="resource-content-wrapper">
        <div v-if="resource.coverImage" class="resource-cover">
          <img :src="resource.coverImage" :alt="resource.title" >
        </div>
        <div v-else-if="resource.excerpt" class="resource-excerpt-highlight">
          {{ resource.excerpt }}
        </div>

        <div class="resource-content">
          <div v-if="resource.videoId" class="video-wrapper">
            <iframe :src="`https://www.youtube.com/embed/${resource.videoId}`" allowfullscreen></iframe>
          </div>
          <div v-if="resource.content" class="content-text">{{ resource.content }}</div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { data: response, pending, error } = await useFetch<{ data: any }>(`/api/resources/${route.params.id}`)
const resource = computed(() => response.value?.data)

const themeLabels: Record<string, string> = {
  logement: '🏠 Logement', banque: '🏦 Banque & Finances', etudes: '🎓 Études', emploi: '💼 Emploi',
  vie_quotidienne: '🛒 Vie quotidienne', sante: '🏥 Santé', orientation: '🧭 Orientation', droits: '⚖️ Droits',
}
const typeLabels: Record<string, string> = { article: '📄 Article', video: '🎥 Vidéo', webinar: '🎙️ Webinaire' }
const levelLabels: Record<string, string> = { predeparture: '✈️ Pré-départ', first_month: '🆕 Premier mois', installed: '🏡 Installé' }

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const currentUrl = computed(() => {
  if (import.meta.server) return `${config.public.appUrl}${route.path}`
  return window.location.href
})
const encodedUrl = computed(() => encodeURIComponent(currentUrl.value))
const encodedTitle = computed(() => encodeURIComponent(resource.value?.title || 'Ressource CAP ALI'))

function copyLink() {
  navigator.clipboard.writeText(currentUrl.value)
  alert('Lien copié dans le presse-papiers !')
}

// SEO Meta
useHead(() => {
  if (!resource.value) return { title: 'Ressource — CAP ALI' }
  return {
    title: `${resource.value.title} — CAP ALI`,
    meta: [
      { name: 'description', content: resource.value.excerpt || `Ressource CAP ALI sur le thème ${themeLabels[resource.value.theme] || resource.value.theme}` },
      { property: 'og:title', content: resource.value.title },
      { property: 'og:description', content: resource.value.excerpt },
      { property: 'og:image', content: resource.value.coverImage },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]
  }
})
</script>

<style scoped>
.resource-detail-page {
  padding-bottom: var(--space-16);
  background: var(--neutral-50);
  min-height: 100vh;
}

.resource-header {
  background: white;
  padding: var(--space-8) 0 var(--space-12);
  border-bottom: 1px solid var(--neutral-200);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-500);
  margin-bottom: var(--space-6);
  transition: color 0.2s;
}
.back-link:hover { color: var(--green-600); }

.resource-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.resource-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--green-50);
  color: var(--green-700);
}
.resource-badge--type { background: #eff6ff; color: #3b82f6; }
.resource-badge--level { background: #fef3c7; color: #92400e; }

.resource-title {
  font-family: var(--font-serif);
  font-size: 40px;
  font-weight: 700;
  color: var(--neutral-900);
  line-height: 1.2;
  margin-bottom: var(--space-6);
  max-width: 900px;
}

.resource-author-date {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  color: var(--neutral-500);
  font-size: var(--text-sm);
}
.resource-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-weight: 500;
  color: var(--neutral-700);
}
.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.author-avatar--placeholder {
  background: var(--green-100);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-transform: uppercase;
}
.resource-date {
  position: relative;
}
.resource-date::before {
  content: '•';
  position: absolute;
  left: -16px;
  color: var(--neutral-300);
}

/* Body container */
.resource-body-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-12);
  margin-top: calc(-1 * var(--space-6));
  align-items: start;
}

/* Sidebar */
.resource-sidebar {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sidebar-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  border: 1px solid var(--neutral-200);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.sidebar-title {
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-400);
  margin-bottom: var(--space-3);
}

.sidebar-text {
  font-size: var(--text-sm);
  color: var(--neutral-700);
  line-height: 1.5;
  margin-bottom: var(--space-4);
}

.sidebar-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.share-buttons {
  display: flex;
  gap: var(--space-2);
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--neutral-50);
  color: var(--neutral-600);
  border: 1px solid var(--neutral-200);
  transition: all 0.2s;
  cursor: pointer;
}
.share-btn:hover {
  background: var(--green-50);
  color: var(--green-600);
  border-color: var(--green-200);
  transform: translateY(-2px);
}

/* Content */
.resource-content-wrapper {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-12);
  border: 1px solid var(--neutral-200);
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.resource-cover {
  margin: calc(-1 * var(--space-10)) calc(-1 * var(--space-12)) var(--space-10);
}
.resource-cover img {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

.resource-excerpt-highlight {
  font-size: 20px;
  line-height: 1.6;
  color: var(--neutral-600);
  font-style: italic;
  padding-left: var(--space-6);
  border-left: 4px solid var(--green-400);
  margin-bottom: var(--space-8);
}

.resource-content {
  font-size: 18px;
  line-height: 1.8;
  color: var(--neutral-800);
}

.resource-content :deep(h2) {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 700;
  color: var(--neutral-900);
  margin: 1.5em 0 0.5em;
}
.resource-content :deep(h3) {
  font-size: 24px;
  font-weight: 600;
  margin: 1.2em 0 0.5em;
}
.resource-content :deep(h4) {
  font-size: 20px;
  font-weight: 600;
  margin: 1em 0 0.5em;
}
.resource-content :deep(p) {
  margin: 0.8em 0;
}
.resource-content :deep(ul),
.resource-content :deep(ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}
.resource-content :deep(li) {
  margin: 0.3em 0;
}
.resource-content :deep(a) {
  color: var(--green-600);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.resource-content :deep(a:hover) {
  color: var(--green-700);
}
.resource-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-xl);
  margin: 1.5em 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.resource-content :deep(blockquote) {
  border-left: 4px solid var(--green-300);
  padding: 1em 1.5em;
  margin: 1.5em 0;
  background: var(--green-50);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  font-style: italic;
  color: var(--neutral-700);
}

.video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-bottom: var(--space-8); border-radius: var(--radius-2xl); background: var(--neutral-900); }
.video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
.content-text { white-space: pre-line; }

@media (max-width: 1024px) {
  .resource-body-container {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .resource-sidebar {
    position: static;
    flex-direction: row;
  }
  .sidebar-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .resource-title { font-size: 32px; }
  .resource-content-wrapper { padding: var(--space-6) var(--space-5); }
  .resource-cover { margin: calc(-1 * var(--space-6)) calc(-1 * var(--space-5)) var(--space-6); }
  .resource-sidebar { flex-direction: column; }
  .resource-content { font-size: 16px; }
  .resource-content :deep(h2) { font-size: 26px; }
}
</style>
