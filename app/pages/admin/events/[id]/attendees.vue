<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/events" class="back-link">← Retour aux événements</NuxtLink>
        <h1 class="admin-page-title">
          {{ pending ? 'Chargement...' : `Inscrits : ${event?.title}` }}
        </h1>
        <p v-if="event" class="admin-page-desc">
          Total : {{ attendees.length }} inscrit(s)
          <span v-if="event.isLimited"> sur {{ event.maxAttendees }} places</span>
        </p>
      </div>
    </div>

    <div v-if="pending" class="loading-state">Chargement des inscrits...</div>
    <div v-else-if="!attendees.length" class="empty-state">
      Personne ne s'est encore inscrit à cet événement.
    </div>
    
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Contact</th>
            <th>Profession</th>
            <th>Date d'inscription</th>
            <th>Paiement</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendee in attendees" :key="attendee.id">
            <td data-label="Participant">
              <span class="user-name">{{ attendee.name }}</span>
            </td>
            <td data-label="Contact">
              <div class="contact-col">
                <a :href="`mailto:${attendee.email}`" class="contact-link">{{ attendee.email }}</a>
                <a v-if="attendee.phone" :href="`tel:${attendee.phone}`" class="contact-link text-muted">{{ attendee.phone }}</a>
              </div>
            </td>
            <td data-label="Profession" class="text-muted">{{ attendee.profession || '—' }}</td>
            <td data-label="Date d'inscription">{{ formatDate(attendee.registeredAt) }}</td>
            <td data-label="Paiement">
              <span class="status-badge" :class="`status-badge--${attendee.paymentStatus}`">
                {{ formatPaymentStatus(attendee.paymentStatus) }}
              </span>
              <div v-if="attendee.paymentProvider" class="payment-provider text-muted">
                via {{ attendee.paymentProvider }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()
const eventId = route.params.id as string

const { data: response, pending } = await useFetch<any>(`/api/admin/events/${eventId}/attendees`)

const event = computed(() => response.value?.data?.event)
const attendees = computed(() => response.value?.data?.attendees || [])

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatPaymentStatus(status: string) {
  const map: Record<string, string> = {
    'free': 'Gratuit',
    'paid': 'Payé',
    'pending': 'En attente',
    'failed': 'Échoué'
  }
  return map[status] || status
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }
.back-link { font-size: var(--text-sm); color: var(--neutral-500); display: inline-block; margin-bottom: var(--space-2); }
.back-link:hover { color: var(--green-600); }

.loading-state, .empty-state { text-align: center; padding: var(--space-12) 0; color: var(--neutral-500); }

.admin-table-wrap { background: var(--neutral-0); border-radius: var(--radius-xl); border: 1px solid var(--neutral-100); overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--neutral-500); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--neutral-100); background: var(--neutral-50); }
.admin-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--neutral-50); font-size: var(--text-sm); }
.admin-table tr:hover td { background: #fafbfc; }

.user-name { font-weight: 500; color: var(--neutral-800); }

.contact-col { display: flex; flex-direction: column; gap: 2px; }
.contact-link { color: var(--neutral-800); text-decoration: none; }
.contact-link:hover { text-decoration: underline; color: var(--green-600); }
.text-muted { color: var(--neutral-500) !important; font-size: 12px; }

.status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full); display: inline-block; }
.status-badge--free { background: var(--neutral-100); color: var(--neutral-700); }
.status-badge--paid { background: var(--green-50); color: var(--green-700); }
.status-badge--pending { background: var(--gold-50); color: var(--gold-700); }
.status-badge--failed { background: var(--red-50); color: var(--red-700); }

.payment-provider { margin-top: 2px; font-size: 11px; text-transform: capitalize; }
</style>
