<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/users" class="back-link">← Retour aux utilisateurs</NuxtLink>
        <h1 class="admin-page-title">{{ user?.name ?? 'Utilisateur' }}</h1>
        <p class="admin-page-desc">{{ user?.email }}</p>
      </div>
      <div class="header-actions">
        <button v-if="!user?.deletedAt" class="btn btn--warm btn--sm" @click="suspendUser">Suspendre</button>
        <button v-else class="btn btn--primary btn--sm" @click="unsuspendUser">Réactiver</button>
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-card">
        <h3 class="detail-card__title">Informations</h3>
        <div class="detail-row"><span class="detail-label">Nom</span><span>{{ user?.name ?? '—' }}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span>{{ user?.email }}</span></div>
        <div class="detail-row"><span class="detail-label">Statut</span><span class="status-badge" :class="`status-badge--${user?.status}`">{{ user?.status }}</span></div>
        <div class="detail-row"><span class="detail-label">Admin</span><span>{{ user?.isAdmin ? 'Oui' : 'Non' }}</span></div>
        <div class="detail-row"><span class="detail-label">Domaine</span><span>{{ user?.domain ?? '—' }}</span></div>
        <div class="detail-row"><span class="detail-label">Ville</span><span>{{ user?.cityCurrentFr ?? '—' }}</span></div>
        <div class="detail-row"><span class="detail-label">Inscrit le</span><span>{{ user?.createdAt ? formatDate(user.createdAt) : '—' }}</span></div>
        <div class="detail-row" v-if="user?.deletedAt"><span class="detail-label">Suspendu le</span><span class="text-danger">{{ formatDate(user.deletedAt) }}</span></div>
      </div>

      <div v-if="user?.mentorProfile" class="detail-card">
        <h3 class="detail-card__title">Profil Mentor</h3>
        <div class="detail-row"><span class="detail-label">Ville</span><span>{{ user.mentorProfile.cityInFrance ?? '—' }}</span></div>
        <div class="detail-row"><span class="detail-label">Max mentorés</span><span>{{ user.mentorProfile.maxMentees }}</span></div>
        <div class="detail-row"><span class="detail-label">Heures/mois</span><span>{{ user.mentorProfile.availableHoursMonth ?? '—' }}</span></div>
        <div class="detail-row"><span class="detail-label">Remote</span><span>{{ user.mentorProfile.acceptsRemote ? '✅' : '❌' }}</span></div>
        <div class="detail-row"><span class="detail-label">Présentiel</span><span>{{ user.mentorProfile.acceptsInperson ? '✅' : '❌' }}</span></div>
        <div class="detail-row"><span class="detail-label">Validé</span><span>{{ user.mentorProfile.isValidated ? '✅ Oui' : '❌ Non' }}</span></div>
        <div class="detail-row" v-if="user.mentorProfile.presentation"><span class="detail-label">Présentation</span></div>
        <p v-if="user.mentorProfile.presentation" class="detail-text">{{ user.mentorProfile.presentation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()

const { data: response, refresh } = await useFetch(`/api/admin/users/${route.params.id}`)
const user = computed(() => response.value?.data)

async function suspendUser() {
  if (!confirm('Suspendre cet utilisateur ?')) return
  await $fetch(`/api/admin/users/${route.params.id}`, { method: 'PATCH', body: { action: 'suspend' } })
  refresh()
}

async function unsuspendUser() {
  if (!confirm('Réactiver cet utilisateur ?')) return
  await $fetch(`/api/admin/users/${route.params.id}`, { method: 'PATCH', body: { action: 'unsuspend' } })
  refresh()
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-8); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }
.back-link { font-size: var(--text-sm); color: var(--neutral-500); display: inline-block; margin-bottom: var(--space-2); }
.back-link:hover { color: var(--green-600); }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
.detail-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); }
.detail-card__title { font-size: var(--text-base); font-weight: 600; color: var(--neutral-900); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--neutral-100); }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) 0; font-size: var(--text-sm); }
.detail-label { color: var(--neutral-500); }
.detail-text { font-size: var(--text-sm); color: var(--neutral-600); line-height: 1.6; padding: var(--space-3); background: var(--neutral-50); border-radius: var(--radius-md); margin-top: var(--space-2); }
.text-danger { color: var(--red-500); font-weight: 500; }

.status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full); }
.status-badge--active { background: var(--green-50); color: var(--green-600); }
.status-badge--mentor { background: var(--gold-50); color: var(--gold-700); }

.header-actions { display: flex; gap: var(--space-2); }

@media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
</style>
