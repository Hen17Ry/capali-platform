<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Gestion des mentors</h1>
        <p class="admin-page-desc">Valider, refuser ou mettre en pause les profils mentors</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="admin-tabs">
      <button v-for="tab in tabs" :key="tab.value" class="admin-tab" :class="{ 'admin-tab--active': filter === tab.value }" @click="filter = tab.value">
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="admin-tab__count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Mentor cards -->
    <div class="mentor-grid">
      <div v-for="mentor in mentors" :key="mentor.userId" class="mentor-card">
        <div class="mentor-card__header">
          <div class="mentor-card__avatar" :style="{ background: getColor(mentor.userName) }">{{ mentor.userName?.[0]?.toUpperCase() }}</div>
          <div>
            <h3 class="mentor-card__name">{{ mentor.userName }}</h3>
            <p class="mentor-card__email">{{ mentor.userEmail }}</p>
          </div>
          <span class="mentor-card__status" :class="{ 'mentor-card__status--validated': mentor.isValidated, 'mentor-card__status--paused': mentor.isPaused }">
            {{ mentor.isPaused ? 'En pause' : mentor.isValidated ? 'Validé' : 'En attente' }}
          </span>
        </div>

        <div class="mentor-card__details">
          <div class="mentor-card__detail"><span>Ville</span><strong>{{ mentor.cityInFrance ?? '—' }}</strong></div>
          <div class="mentor-card__detail"><span>Domaine</span><strong>{{ mentor.userDomain ?? '—' }}</strong></div>
          <div class="mentor-card__detail"><span>Max mentorés</span><strong>{{ mentor.maxMentees }}</strong></div>
          <div class="mentor-card__detail"><span>Heures/mois</span><strong>{{ mentor.availableHoursMonth ?? '—' }}</strong></div>
          <div class="mentor-card__detail"><span>Remote</span><strong>{{ mentor.acceptsRemote ? '✅' : '❌' }}</strong></div>
          <div class="mentor-card__detail"><span>Présentiel</span><strong>{{ mentor.acceptsInperson ? '✅' : '❌' }}</strong></div>
        </div>

        <p v-if="mentor.motivation" class="mentor-card__pres"><span>Motivation : </span>{{ mentor.motivation }}</p>

        <div class="mentor-card__actions">
          <button v-if="!mentor.isValidated" class="btn btn--primary btn--sm" @click="doAction(mentor.userId, 'validate')">✓ Valider</button>
          <button v-if="!mentor.isValidated" class="btn btn--warm btn--sm" @click="doAction(mentor.userId, 'refuse')">✗ Refuser</button>
          <button v-if="mentor.isValidated && !mentor.isPaused" class="btn btn--outline btn--sm" @click="doAction(mentor.userId, 'pause')">Mettre en pause</button>
          <button v-if="mentor.isPaused" class="btn btn--primary btn--sm" @click="doAction(mentor.userId, 'unpause')">Réactiver</button>
        </div>
      </div>

      <div v-if="!mentors?.length" class="empty-state">
        <p>Aucun mentor correspondant à ce filtre.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()

const filter = ref((route.query.filter as string) || 'pending')

const tabs = computed(() => [
  { label: 'En attente', value: 'pending', count: mentors.value?.filter((m: any) => !m.isValidated).length },
  { label: 'Validés', value: 'validated' },
  { label: 'En pause', value: 'paused' },
  { label: 'Tous', value: 'all' },
])

const { data: response, refresh } = await useFetch('/api/admin/mentors', {
  query: computed(() => ({ filter: filter.value })),
})

const mentors = computed(() => response.value?.data ?? [])

watch(filter, () => refresh())

async function doAction(id: string, action: string) {
  const labels: Record<string, string> = { validate: 'Valider ce mentor ?', refuse: 'Refuser ce mentor ?', pause: 'Mettre en pause ?', unpause: 'Réactiver ?' }
  if (!confirm(labels[action] || 'Confirmer ?')) return
  await $fetch(`/api/admin/mentors/${id}`, { method: 'PATCH', body: { action } })
  refresh()
}

function getColor(name: string) {
  const colors = ['#1B6B3A', '#D4A017', '#C7372F', '#3b82f6', '#8b5cf6']
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length]
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }

.admin-tabs { display: flex; gap: var(--space-1); margin-bottom: var(--space-6); background: var(--neutral-0); border-radius: var(--radius-lg); padding: 4px; border: 1px solid var(--neutral-200); width: fit-content; }
.admin-tab { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); font-weight: 500; color: var(--neutral-500); border-radius: var(--radius-md); transition: all var(--transition-fast); display: flex; align-items: center; gap: var(--space-2); }
.admin-tab:hover { color: var(--neutral-700); }
.admin-tab--active { background: var(--green-500); color: var(--neutral-0); }
.admin-tab__count { font-size: 11px; background: rgba(255,255,255,0.2); padding: 0 6px; border-radius: var(--radius-full); }
.admin-tab--active .admin-tab__count { background: rgba(255,255,255,0.25); }

.mentor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: var(--space-4); }

.mentor-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); transition: all var(--transition-base); }
.mentor-card:hover { box-shadow: var(--shadow-md); }

.mentor-card__header { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.mentor-card__avatar { width: 40px; height: 40px; border-radius: var(--radius-full); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
.mentor-card__name { font-weight: 600; font-size: var(--text-base); color: var(--neutral-900); }
.mentor-card__email { font-size: var(--text-xs); color: var(--neutral-400); }
.mentor-card__status { margin-left: auto; font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: var(--radius-full); background: #fef3c7; color: #92400e; }
.mentor-card__status--validated { background: var(--green-50); color: var(--green-600); }
.mentor-card__status--paused { background: var(--neutral-100); color: var(--neutral-500); }

.mentor-card__details { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-4); }
.mentor-card__detail { font-size: var(--text-sm); color: var(--neutral-500); display: flex; justify-content: space-between; padding: var(--space-1) 0; }
.mentor-card__detail strong { color: var(--neutral-800); font-weight: 500; }

.mentor-card__pres { font-size: var(--text-sm); color: var(--neutral-600); line-height: 1.6; padding: var(--space-3); background: var(--neutral-50); border-radius: var(--radius-md); margin-bottom: var(--space-4); }

.mentor-card__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.empty-state { text-align: center; padding: var(--space-12); color: var(--neutral-400); grid-column: 1 / -1; }

@media (max-width: 640px) { .mentor-grid { grid-template-columns: 1fr; } .mentor-card__details { grid-template-columns: 1fr; } }
</style>
