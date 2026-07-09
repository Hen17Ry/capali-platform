<template>
  <div class="event-detail-page">
    <div v-if="pending" class="container loading-state">
      Chargement des informations de l'événement...
    </div>
    <div v-else-if="!event" class="container empty-state">
      <h2>Événement introuvable</h2>
      <p>Cet événement n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/events" class="btn btn--primary mt-4">Retour aux événements</NuxtLink>
    </div>
    <div v-else>
      <section class="event-hero" :style="event.coverImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${event.coverImage})` } : {}">
        <div class="container event-hero__container">
          <div class="event-hero__content">
            <span class="event-type-badge">{{ getTypeLabel(event.type) }}</span>
            <h1 class="event-title">{{ event.title }}</h1>
            
            <div class="event-meta">
              <div class="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ formatDate(event.eventDate) }} à {{ formatTime(event.eventDate) }}</span>
              </div>
              <div v-if="event.city || event.type === 'online'" class="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ event.type === 'online' ? 'Événement en ligne' : event.city }}</span>
              </div>
            </div>
            
            <div class="event-actions mt-8">
              <a v-if="event.registrationUrl" :href="event.registrationUrl" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">
                S'inscrire à l'événement
              </a>
              <button v-else class="btn btn--outline btn--lg" disabled>
                Inscription bientôt disponible
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="event-content-section container">
        <div class="event-content-layout">
          <div class="event-main-content">
            <h2>À propos de l'événement</h2>
            <div v-if="event.description" class="event-description prose" v-html="formatDescription(event.description)"/>
            <p v-else class="text-neutral-500 italic">Aucune description fournie pour cet événement.</p>
          </div>
          
          <div class="event-sidebar">
            <div class="sidebar-card">
              <h3>Détails</h3>
              <ul class="sidebar-list">
                <li>
                  <span class="label">Date :</span>
                  <span class="value">{{ formatDate(event.eventDate) }}</span>
                </li>
                <li>
                  <span class="label">Heure :</span>
                  <span class="value">{{ formatTime(event.eventDate) }}</span>
                </li>
                <li>
                  <span class="label">Lieu :</span>
                  <span class="value">{{ event.type === 'online' ? 'En ligne' : event.city || 'Non spécifié' }}</span>
                </li>
              </ul>
              
              <div class="sidebar-actions">
                <a v-if="event.registrationUrl" :href="event.registrationUrl" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--full">
                  S'inscrire
                </a>
              </div>
            </div>
            
            <div class="mt-6 text-center">
              <NuxtLink to="/events" class="text-green-600 hover:underline font-medium">
                &larr; Voir tous les événements
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const eventId = route.params.id as string

const { data: response, pending } = await useFetch<{ data: any }>(`/api/events/${eventId}`)
const event = computed(() => response.value?.data)

useHead({
  title: computed(() => event.value?.title ? `${event.value.title} — Événements CAP ALI` : 'Événement CAP ALI'),
  meta: [
    { name: 'description', content: computed(() => event.value?.description || 'Détails de l\'événement CAP ALI') }
  ]
})

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    france: '🇫🇷 France',
    benin: '🇧🇯 Bénin',
    online: '🌐 En ligne'
  }
  return labels[type] || type
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDescription(text: string) {
  // Remplacer les retours à la ligne par des <br> ou <p>
  return text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
}
</script>

<style scoped>
.loading-state, .empty-state {
  padding: var(--space-24) 0;
  text-align: center;
}
.empty-state h2 { font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-4); color: var(--neutral-900); }
.empty-state p { color: var(--neutral-600); margin-bottom: var(--space-8); }

.event-hero {
  background-color: var(--green-900);
  background-size: cover;
  background-position: center;
  color: white;
  padding: var(--space-20) 0;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.event-actions{
  margin-top: 16px;
}

.event-hero__content {
  max-width: 800px;
}

.event-type-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
}

.event-title {
  font-family: var(--font-serif);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-6);
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.9);
}

.event-content-section {
  padding: var(--space-16) var(--space-4);
}

.event-content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.event-main-content h2 {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--neutral-900);
}

.event-description {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--neutral-700);
}

.event-description :deep(p) {
  margin-bottom: var(--space-4);
}

.sidebar-card {
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  padding: var(--space-6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.sidebar-card h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: var(--neutral-900);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--neutral-100);
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6) 0;
}

.sidebar-list li {
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-list .label {
  font-size: var(--text-sm);
  color: var(--neutral-500);
  font-weight: 500;
}

.sidebar-list .value {
  font-size: var(--text-base);
  color: var(--neutral-900);
  font-weight: 600;
}

@media (max-width: 768px) {
  .event-content-layout {
    grid-template-columns: 1fr;
  }
}
</style>
