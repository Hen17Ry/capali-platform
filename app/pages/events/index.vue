<template>
  <div class="events-page">
    <section class="events-hero">
      <div class="events-hero__inner">
        <h1 class="events-hero__title">Événements <strong>CAP ALI</strong></h1>
        <p class="events-hero__desc">Participez à nos ateliers, rencontres et webinaires pour faciliter votre intégration.</p>
      </div>
    </section>

    <div class="container events-container">
      <div v-if="pending" class="events-loading">
        Chargement des événements...
      </div>
      
      <div v-else-if="eventsList.length" class="events-grid">
        <div v-for="event in eventsList" :key="event.id" class="event-card" @click="navigateTo(`/events/${event.id}`)" style="cursor: pointer;">
          <div class="event-card__cover" :style="event.coverImage ? { backgroundImage: `url(${event.coverImage})` } : {}">
            <span v-if="!event.coverImage" class="event-card__cover-placeholder">
              {{ getTypeEmoji(event.type) }}
            </span>
            <div class="event-card__date-badge">
              <span class="date-badge__day">{{ getDay(event.eventDate) }}</span>
              <span class="date-badge__month">{{ getMonth(event.eventDate) }}</span>
            </div>
            <span class="event-card__type-badge">{{ getTypeLabel(event.type) }}</span>
          </div>
          
          <div class="event-card__body">
            <h3 class="event-card__title">{{ event.title }}</h3>
            
            <div class="event-card__details">
              <div class="event-card__detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ formatTime(event.eventDate) }}
              </div>
              <div v-if="event.city || event.type === 'online'" class="event-card__detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ event.type === 'online' ? 'En ligne' : event.city }}
              </div>
            </div>
            
            <p v-if="event.description" class="event-card__desc">{{ event.description }}</p>
          </div>
          
          <div class="event-card__footer">
            <a v-if="event.registrationUrl" :href="event.registrationUrl" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--full" @click.stop>
              S'inscrire
            </a>
            <button v-else class="btn btn--outline btn--full" disabled @click.stop>
              Inscription bientôt disponible
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="events-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <h3>Aucun événement prévu</h3>
        <p>Revenez bientôt pour découvrir nos prochains ateliers et rencontres !</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Événements — CAP ALI',
  meta: [{ name: 'description', content: 'Découvrez les événements organisés par CAP ALI : rencontres, ateliers et webinaires.' }]
})

const { data: response, pending } = await useFetch<{ data: any[] }>('/api/events')
const eventsList = computed(() => response.value?.data || [])

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    france: '🇫🇷 France',
    benin: '🇧🇯 Bénin',
    online: '🌐 En ligne'
  }
  return labels[type] || type
}

function getTypeEmoji(type: string) {
  const emojis: Record<string, string> = {
    france: '🇫🇷',
    benin: '🇧🇯',
    online: '🌐'
  }
  return emojis[type] || '📅'
}

function getDay(dateStr: string) {
  return new Date(dateStr).getDate().toString().padStart(2, '0')
}

function getMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.events-hero { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 60px 24px 48px; text-align: center; }
.events-hero__inner { max-width: 680px; margin: 0 auto; }
.events-hero__title { font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 700; color: white; margin-bottom: var(--space-3); }
.events-hero__title strong { color: #d4a843; }
.events-hero__desc { color: rgba(255,255,255,0.7); font-size: var(--text-base); }

.events-container { padding-top: var(--space-12); padding-bottom: var(--space-16); }

.events-loading { text-align: center; color: var(--neutral-500); padding: var(--space-12); }

.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-8); }

.event-card { background: var(--neutral-0); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--neutral-100); box-shadow: 0 4px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; transition: all 0.25s ease; }
.event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: var(--green-200); }

.event-card__cover { height: 200px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; }
.event-card__cover-placeholder { font-size: 64px; opacity: 0.2; }

.event-card__date-badge { position: absolute; top: 16px; left: 16px; background: white; border-radius: var(--radius-lg); padding: 8px 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; min-width: 60px; }
.date-badge__day { font-size: 24px; font-weight: 800; color: var(--green-700); line-height: 1; }
.date-badge__month { font-size: 11px; font-weight: 700; color: var(--neutral-500); text-transform: uppercase; margin-top: 2px; }

.event-card__type-badge { position: absolute; top: 16px; right: 16px; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: var(--radius-full); background: rgba(255,255,255,0.95); backdrop-filter: blur(4px); color: var(--neutral-800); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.event-card__body { padding: var(--space-6); flex: 1; display: flex; flex-direction: column; gap: var(--space-4); }
.event-card__title { font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--neutral-900); line-height: 1.3; }

.event-card__details { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.event-card__detail-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--neutral-600); }
.event-card__detail-item svg { color: var(--green-500); }

.event-card__desc { font-size: 14px; color: var(--neutral-500); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; line-clamp: 3; overflow: hidden; }

.event-card__footer { padding: 0 var(--space-6) var(--space-6); }
.btn--full { width: 100%; display: flex; justify-content: center; }

.events-empty { text-align: center; padding: var(--space-16) var(--space-6); color: var(--neutral-400); background: var(--neutral-0); border-radius: var(--radius-2xl); border: 2px dashed var(--neutral-200); }
.events-empty svg { margin: 0 auto var(--space-4); color: var(--neutral-300); }
.events-empty h3 { font-size: var(--text-lg); font-weight: 600; color: var(--neutral-600); margin-bottom: var(--space-2); }
.events-empty p { font-size: var(--text-sm); }
</style>
