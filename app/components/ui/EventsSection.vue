<template>
  <section id="events" class="section events">
    <div class="container">
      <div v-if="eventsList.length > 0">
        <!-- Header -->
        <div class="events__header reveal">
          <span class="section__overtitle">{{ $t('events.overtitle') }}</span>
          <h2 class="section__title">{{ $t('events.title') }}</h2>
          <p class="section__description">{{ $t('events.description') }}</p>
        </div>
        
        <!-- Events Grid -->
        <div class="events-grid reveal-stagger">
          <div v-for="event in eventsList" :key="event.id" class="event-card">
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
                <div class="event-card__detail-item" v-if="event.city || event.type === 'online'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ event.type === 'online' ? 'En ligne' : event.city }}
                </div>
              </div>
            </div>
            
            <div class="event-card__footer">
              <a v-if="event.registrationUrl" :href="event.registrationUrl" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm btn--full">
                S'inscrire
              </a>
              <button v-else class="btn btn--outline btn--sm btn--full" disabled>Bientôt disponible</button>
            </div>
          </div>
        </div>
        
        <div class="events__more">
          <NuxtLink to="/events" class="btn btn--outline btn--lg">Voir tous les événements</NuxtLink>
        </div>
      </div>
      
      <!-- Empty state layout -->
      <div v-else class="events__layout">
        <div class="events__content reveal--left reveal">
          <span class="section__overtitle">{{ $t('events.overtitle') }}</span>
          <h2 class="section__title">{{ $t('events.title') }}</h2>
          <p class="section__description">{{ $t('events.description') }}</p>
          <div class="events__empty">
            <div class="events__empty-calendar">
              <div class="events__cal-header"><span>{{ currentMonth }}</span></div>
              <div class="events__cal-dots"><span /><span /><span /></div>
              <p class="events__cal-text">{{ $t('events.empty') }}</p>
            </div>
          </div>
          <NuxtLink to="/events" class="btn btn--outline btn--lg">{{ $t('events.cta') }}</NuxtLink>
        </div>
        <div class="events__visual reveal--right reveal">
          <img src="/community-event.png" alt="Événement CAP ALI" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const currentMonth = computed(() =>
  new Date().toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
)

const { data: response } = await useFetch<{ data: any[] }>('/api/events')
// Prenez les 3 premiers événements
const eventsList = computed(() => response.value?.data?.slice(0, 3) || [])

function getTypeLabel(type: string) {
  const labels: Record<string, string> = { france: '🇫🇷 France', benin: '🇧🇯 Bénin', online: '🌐 En ligne' }
  return labels[type] || type
}

function getTypeEmoji(type: string) {
  const emojis: Record<string, string> = { france: '🇫🇷', benin: '🇧🇯', online: '🌐' }
  return emojis[type] || '📅'
}

function getDay(dateStr: string) { return new Date(dateStr).getDate().toString().padStart(2, '0') }
function getMonth(dateStr: string) { return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase() }
function formatTime(dateStr: string) { return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
</script>

<style scoped>
/* Header */
.events__header { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: var(--space-12); }
.events__header .section__overtitle::before { display: none; }

/* Empty layout */
.events__layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center; }
.events__empty { margin: var(--space-8) 0; }
.events__empty-calendar { background: var(--neutral-50); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--neutral-200); max-width: 380px; }
.events__cal-header { background: var(--green-500); color: var(--neutral-0); padding: var(--space-3) var(--space-4); font-weight: 600; font-size: var(--text-sm); text-transform: capitalize; }
.events__cal-dots { display: flex; gap: var(--space-3); padding: var(--space-4); }
.events__cal-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--neutral-200); }
.events__cal-text { padding: var(--space-4) var(--space-4) var(--space-6); font-size: var(--text-sm); color: var(--neutral-400); font-style: italic; }
.events__visual { border-radius: var(--radius-2xl); overflow: hidden; box-shadow: var(--shadow-xl); }
.events__visual img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }

/* Grid layout */
.events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); margin-bottom: var(--space-10); }

.event-card { background: var(--neutral-0); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--neutral-100); box-shadow: 0 4px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; transition: all 0.25s ease; }
.event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: var(--green-200); }

.event-card__cover { height: 160px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; }
.event-card__cover-placeholder { font-size: 48px; opacity: 0.2; }

.event-card__date-badge { position: absolute; top: 12px; left: 12px; background: white; border-radius: var(--radius-md); padding: 6px 10px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; min-width: 50px; }
.date-badge__day { font-size: 18px; font-weight: 800; color: var(--green-700); line-height: 1; }
.date-badge__month { font-size: 10px; font-weight: 700; color: var(--neutral-500); text-transform: uppercase; margin-top: 2px; }

.event-card__type-badge { position: absolute; top: 12px; right: 12px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); background: rgba(255,255,255,0.95); backdrop-filter: blur(4px); color: var(--neutral-800); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.event-card__body { padding: var(--space-5); flex: 1; display: flex; flex-direction: column; gap: var(--space-3); }
.event-card__title { font-family: var(--font-serif); font-size: 18px; font-weight: 700; color: var(--neutral-900); line-height: 1.3; }

.event-card__details { display: flex; flex-wrap: wrap; gap: var(--space-3); }
.event-card__detail-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: var(--neutral-600); }
.event-card__detail-item svg { color: var(--green-500); }

.event-card__footer { padding: 0 var(--space-5) var(--space-5); }
.btn--full { width: 100%; display: flex; justify-content: center; }

.events__more { text-align: center; }

@media (max-width: 1024px) {
  .events-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .events__layout { grid-template-columns: 1fr; gap: var(--space-8); }
  .events__visual { order: -1; }
  .events-grid { grid-template-columns: 1fr; }
}
</style>
