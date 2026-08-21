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
      
      <div v-else class="events-sections">
        <!-- Événements à venir -->
        <div v-if="upcomingEvents.length" class="events-section mb-16">
          <h2 class="section-title">Événements à venir</h2>
          <div class="events-grid">
            <div v-for="event in upcomingEvents" :key="event.id" class="event-card" @click="navigateTo(`/events/${event.id}`)">
              <div class="event-card__cover" :style="event.coverImage ? { backgroundImage: `url(${event.coverImage})` } : {}">
                <div class="event-card__overlay"/>
                <span v-if="!event.coverImage" class="event-card__cover-placeholder">
                  {{ getTypeEmoji(event.type) }}
                </span>
                <div class="event-card__date-badge">
                  <span class="date-badge__month">{{ getMonth(event.eventDate) }}</span>
                  <span class="date-badge__day">{{ getDay(event.eventDate) }}</span>
                </div>
                <span class="event-card__type-badge">{{ getTypeLabel(event.type) }}</span>
              </div>
              
              <div class="event-card__body">
                <h3 class="event-card__title">{{ event.title }}</h3>
                <p v-if="event.description" class="event-card__desc">{{ event.description }}</p>
                
                <div class="event-card__details">
                  <div class="event-card__detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {{ formatTime(event.eventDate) }}
                  </div>
                  <div v-if="event.city || event.type === 'online'" class="event-card__detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ event.type === 'online' ? 'En ligne' : event.city }}
                  </div>
                  <div v-if="event.registrationDeadline" class="event-card__detail-item alert-text">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Limite: {{ formatDateCustom(event.registrationDeadline) }}
                  </div>
                </div>
              </div>
              
              <div class="event-card__footer">
                <NuxtLink v-if="event.registrationUrl" :to="`/events/${event.id}`" :href="event.registrationUrl" rel="noopener noreferrer" class="btn-register" @click.stop>
                  S'inscrire maintenant
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </NuxtLink>
                <button v-else class="btn-register btn-disabled" disabled @click.stop>
                  Bientôt disponible
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Événements passés -->
        <div v-if="pastEvents.length" class="events-section">
          <h2 class="section-title">Événements passés</h2>
          <div class="events-grid past-events-grid">
            <div v-for="event in pastEvents" :key="event.id" class="event-card event-card--past" @click="navigateTo(`/events/${event.id}`)">
              <div class="event-card__cover" :style="event.coverImage ? { backgroundImage: `url(${event.coverImage})` } : {}">
                <div class="event-card__overlay"/>
                <span v-if="!event.coverImage" class="event-card__cover-placeholder">
                  {{ getTypeEmoji(event.type) }}
                </span>
                <div class="event-card__date-badge">
                  <span class="date-badge__month">{{ getMonth(event.eventDate) }}</span>
                  <span class="date-badge__day">{{ getDay(event.eventDate) }}</span>
                </div>
                <span class="event-card__type-badge">{{ getTypeLabel(event.type) }}</span>
              </div>
              
              <div class="event-card__body">
                <h3 class="event-card__title">{{ event.title }}</h3>
                <p v-if="event.description" class="event-card__desc">{{ event.description }}</p>
              </div>
              
              <div class="event-card__footer">
                <NuxtLink :to="`/events/${event.id}`" class="btn-register btn-outline-primary" @click.stop>
                  Voir les détails
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!pending && !upcomingEvents.length && !pastEvents.length" class="events-empty">
        <div class="empty-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
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

const upcomingEvents = computed(() => {
  const now = new Date()
  return eventsList.value.filter(e => new Date(e.eventDate) >= now)
})

const pastEvents = computed(() => {
  const now = new Date()
  return eventsList.value.filter(e => new Date(e.eventDate) < now)
})

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

function formatDateCustom(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.events-hero { 
  background: linear-gradient(135deg, #133a28 0%, #1a523a 100%); 
  padding: 80px 24px 64px; 
  text-align: center; 
  position: relative;
  overflow: hidden;
}
.events-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(circle at 20% 150%, rgba(212, 168, 67, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% -20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
  pointer-events: none;
}
.events-hero__inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
.events-hero__title { font-family: var(--font-serif); font-size: clamp(36px, 5vw, 48px); font-weight: 800; color: white; margin-bottom: var(--space-4); letter-spacing: -0.02em; }
.events-hero__title strong { color: #d4a843; font-weight: 800; }
.events-hero__desc { color: rgba(255,255,255,0.85); font-size: var(--text-lg); line-height: 1.6; font-weight: 400; }

.events-container { padding-top: 64px; padding-bottom: 96px; }

.events-loading { text-align: center; color: var(--neutral-500); padding: var(--space-12); font-size: var(--text-lg); }

.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; }

.event-card { 
  background: var(--neutral-0); 
  border-radius: 24px; 
  overflow: hidden; 
  border: 1px solid rgba(0,0,0,0.04); 
  box-shadow: 0 10px 40px rgba(0,0,0,0.03); 
  display: flex; 
  flex-direction: column; 
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
  cursor: pointer;
  position: relative;
}
.event-card:hover { 
  transform: translateY(-8px); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); 
  border-color: var(--green-200); 
}

.event-card__cover { 
  height: 220px; 
  background: var(--neutral-100); 
  background-size: cover; 
  background-position: center; 
  position: relative; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}
.event-card__overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
}
.event-card__cover-placeholder { font-size: 64px; opacity: 0.3; z-index: 1; }

.event-card__date-badge { 
  position: absolute; 
  top: 20px; 
  left: 20px; 
  background: rgba(255, 255, 255, 0.9); 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px; 
  padding: 8px; 
  text-align: center; 
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); 
  display: flex; 
  flex-direction: column; 
  min-width: 64px; 
  z-index: 2;
  border: 1px solid rgba(255,255,255,0.5);
}
.date-badge__month { font-size: 11px; font-weight: 700; color: var(--green-700); text-transform: uppercase; margin-bottom: 2px; letter-spacing: 0.05em; }
.date-badge__day { font-size: 28px; font-weight: 800; color: var(--neutral-900); line-height: 1; }

.event-card__type-badge { 
  position: absolute; 
  top: 20px; 
  right: 20px; 
  font-size: 12px; 
  font-weight: 600; 
  padding: 8px 14px; 
  border-radius: 30px; 
  background: rgba(0, 0, 0, 0.5); 
  backdrop-filter: blur(8px); 
  -webkit-backdrop-filter: blur(8px);
  color: white; 
  z-index: 2;
  letter-spacing: 0.02em;
}

.event-card__body { padding: 28px 24px 20px; flex: 1; display: flex; flex-direction: column; }
.event-card__title { font-family: var(--font-serif); font-size: 22px; font-weight: 800; color: var(--neutral-900); line-height: 1.3; margin-bottom: 12px; transition: color 0.2s; }
.event-card:hover .event-card__title { color: var(--green-700); }

.event-card__desc { font-size: 15px; color: var(--neutral-600); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2; overflow: hidden; margin-bottom: 20px; }

.event-card__details { display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--neutral-100); }
.event-card__detail-item { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: var(--neutral-700); }
.event-card__detail-item svg { color: var(--green-600); opacity: 0.8; }
.alert-text { color: #d97706; }
.alert-text svg { color: #d97706; }

.event-card__footer { padding: 0 24px 24px; }
.btn-register {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: var(--green-700);
  color: white;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn-register:hover {
  background: var(--green-800);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(27, 67, 50, 0.2);
}
.btn-register.btn-disabled {
  background: var(--neutral-100);
  color: var(--neutral-400);
  pointer-events: none;
  box-shadow: none;
}

.events-empty { text-align: center; padding: 80px 24px; color: var(--neutral-500); background: var(--neutral-50); border-radius: 32px; border: 2px dashed var(--neutral-200); }
.empty-icon-wrap { width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); color: var(--green-600); }
.events-empty h3 { font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: var(--neutral-900); margin-bottom: 8px; }
.events-empty p { font-size: 16px; max-width: 400px; margin: 0 auto; }

.section-title { font-family: var(--font-serif); font-size: 28px; font-weight: 800; color: var(--neutral-900); margin-bottom: 24px; border-bottom: 2px solid var(--neutral-100); padding-bottom: 8px; }
.past-events-grid .event-card--past { opacity: 0.9; }
.past-events-grid .event-card--past:hover { opacity: 1; border-color: var(--neutral-300); }
.past-events-grid .event-card__cover { filter: grayscale(50%); transition: filter 0.3s; }
.past-events-grid .event-card--past:hover .event-card__cover { filter: grayscale(0%); }
.btn-outline-primary {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px;
  background: transparent; color: var(--green-700); border: 1px solid var(--green-700);
  border-radius: 14px; font-weight: 600; font-size: 15px; transition: all 0.3s ease; text-decoration: none;
}
.btn-outline-primary:hover { background: var(--green-50); }
</style>
