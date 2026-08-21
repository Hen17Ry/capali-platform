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
              <NuxtLink v-if="gallery" :to="`/galleries/${gallery.id}`" class="btn btn--primary btn--lg" style="background: var(--gold-600); border-color: var(--gold-600);">
                Voir la galerie photo
              </NuxtLink>
              <button v-else-if="!isPastEvent" class="btn btn--primary btn--lg" @click="showRegistrationModal = true">
                S'inscrire à l'événement
              </button>
              <button v-else class="btn btn--outline btn--lg" style="background: rgba(255,255,255,0.1); color: white; border-color: rgba(255,255,255,0.2);" disabled>
                Événement terminé
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="event-content-section container">
        <div class="event-content-layout">
          <div class="event-main-content">
            <h2>À propos de l'événement</h2>
            <!-- eslint-disable-next-line vue/no-v-html -->
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
                <li v-if="event.registrationDeadline">
                  <span class="label">Date limite d'inscription :</span>
                  <span class="value">{{ formatDate(event.registrationDeadline) }}</span>
                </li>
                <li v-if="event.isPaid">
                  <span class="label">Tarif :</span>
                  <span class="value price-highlight">{{ event.priceEur }} €</span>
                </li>
                <li v-else>
                  <span class="label">Tarif :</span>
                  <span class="value price-highlight text-green-600">Gratuit</span>
                </li>
              </ul>
              
              <div class="sidebar-actions">
                <NuxtLink v-if="gallery" :to="`/galleries/${gallery.id}`" class="btn btn--primary btn--full" style="background: var(--gold-600); border-color: var(--gold-600);">
                  Voir la galerie
                </NuxtLink>
                <button v-else-if="!isPastEvent" class="btn btn--primary btn--full" @click="showRegistrationModal = true">
                  S'inscrire
                </button>
                <button v-else class="btn btn--outline btn--full" disabled>
                  Terminé
                </button>
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
    
    <ClientOnly>
      <EventsEventRegistrationModal 
        v-if="event"
        v-model="showRegistrationModal" 
        :event="event"
        @success="handleRegistrationSuccess"
      />
      
      <UiBaseModal
        v-model="paymentStatusModal.show"
        :title="paymentStatusModal.title"
        max-width="400px"
      >
        <div class="text-center py-4">
          <div v-if="paymentStatusModal.type === 'success'" class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div v-else class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          
          <p class="text-neutral-700 text-lg">{{ paymentStatusModal.message }}</p>
          
          <button class="btn btn--primary mt-6 w-full" @click="paymentStatusModal.show = false">
            Fermer
          </button>
        </div>
      </UiBaseModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const eventId = route.params.id as string

const { data: response, pending, refresh } = await useFetch<{ data: any }>(`/api/events/${eventId}`)
const event = computed(() => response.value?.data)

const { data: galleryRes } = await useFetch<{ data: any }>(`/api/galleries/by-event/${eventId}`)
const gallery = computed(() => galleryRes.value?.data)

const isPastEvent = computed(() => {
  if (!event.value) return false
  return new Date(event.value.eventDate) < new Date()
})

const showRegistrationModal = ref(false)

const paymentStatusModal = reactive({
  show: false,
  title: '',
  message: '',
  type: 'success' as 'success' | 'error'
})

function showAlert(title: string, message: string, type: 'success' | 'error' = 'success') {
  paymentStatusModal.title = title
  paymentStatusModal.message = message
  paymentStatusModal.type = type
  paymentStatusModal.show = true
}

// Si l'utilisateur revient après un paiement Stripe ou Kkiapay
onMounted(async () => {
  if (route.query.payment === 'success') {
    const sessionId = route.query.session_id as string
    const attendeeId = route.query.attendeeId as string
    
    if (sessionId && attendeeId) {
      try {
        const res = await $fetch(`/api/events/${eventId}/verify`, {
          method: 'POST',
          body: {
            attendeeId,
            provider: 'stripe',
            sessionId
          }
        })
        if (res.success) {
          showAlert('Paiement réussi', 'Paiement Stripe réussi ! Vous êtes bien inscrit. Un mail de confirmation vous a été envoyé.')
          handleRegistrationSuccess()
        } else {
          showAlert('Échec du paiement', 'Le paiement Stripe n\'a pas pu être validé.', 'error')
        }
      } catch(e: any) {
        showAlert('Erreur', 'Erreur lors de la validation Stripe : ' + (e?.data?.message || e?.message), 'error')
      }
    }
    router.replace({ query: {} }) // Nettoyer l'URL
  } else if (route.query.payment === 'canceled') {
    showAlert('Paiement annulé', 'Le paiement Stripe a été annulé.', 'error')
    router.replace({ query: {} })
  } else if (route.query.payment === 'kkiapay_success') {
    // Vérification du paiement Kkiapay après redirection
    const transactionId = route.query.transaction_id as string
    const attendeeId = route.query.attendeeId as string
    
    if (transactionId && attendeeId) {
      try {
        const res = await $fetch(`/api/events/${eventId}/verify`, {
          method: 'POST',
          body: {
            attendeeId,
            provider: 'kkiapay',
            transactionId
          }
        })
        if (res.success) {
          showAlert('Inscription confirmée', 'Paiement Kkiapay réussi ! Vous êtes bien inscrit. Un mail de confirmation vous a été envoyé.')
          handleRegistrationSuccess()
        } else {
          showAlert('Échec de validation', 'Le paiement Kkiapay n\'a pas pu être validé.', 'error')
        }
      } catch(e: any) {
        showAlert('Erreur', 'Erreur lors de la validation Kkiapay : ' + (e?.data?.message || e?.message), 'error')
      }
    }
    router.replace({ query: {} }) // Nettoyer l'URL
  }
})

function handleRegistrationSuccess() {
  refresh() // Rafraîchir les données (utile si places limitées)
}

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

.price-highlight {
  font-size: var(--text-lg);
  font-weight: 700;
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
