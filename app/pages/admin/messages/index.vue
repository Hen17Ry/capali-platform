<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Messagerie (Vue 360°)</h1>
        <p class="admin-page-desc">Consultez les conversations entre mentors et mentorés pour des raisons de sécurité.</p>
      </div>
    </div>

    <div class="reports-list">
      <div v-for="conv in conversations" :key="conv.id" class="report-card">
        <div class="report-card__header">
          <div class="report-card__user">
            <div>
              <span class="report-card__name">Mentor: {{ conv.mentorName }}</span>
              <span class="report-card__email">Mentoré: {{ conv.menteeName }}</span>
            </div>
          </div>
          <div class="report-card__meta">
            <span class="badge" :class="conv.status === 'closed' ? 'badge--closed' : 'badge--active'">
              {{ conv.status === 'closed' ? 'Fermée' : 'Active' }}
            </span>
            <span class="report-card__date">Modifié le {{ formatDate(conv.updatedAt) }}</span>
          </div>
        </div>

        <div class="report-card__actions">
          <NuxtLink :to="`/admin/messages/${conv.id}`" class="btn btn--outline btn--sm">Voir la conversation</NuxtLink>
        </div>
      </div>

      <div v-if="!conversations.length" class="empty-state">
        <p>Aucune conversation trouvée.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { data } = await useFetch('/api/admin/messages')
const conversations = computed(() => data.value?.data || [])

function formatDate(d: string) { 
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) 
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }

.reports-list { display: flex; flex-direction: column; gap: var(--space-4); }
.report-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); border-left: 4px solid var(--neutral-400); }

.report-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); }
.report-card__user { display: flex; align-items: center; gap: var(--space-3); }
.report-card__name { display: block; font-weight: 600; font-size: var(--text-sm); color: var(--neutral-900); }
.report-card__email { display: block; font-size: var(--text-sm); color: var(--neutral-600); margin-top: 2px; }

.report-card__meta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; }
.badge--active { background: var(--green-100); color: var(--green-800); }
.badge--closed { background: var(--red-100); color: var(--red-800); }
.report-card__date { font-size: var(--text-xs); color: var(--neutral-400); }

.report-card__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.empty-state { text-align: center; padding: var(--space-16); color: var(--neutral-400); }
</style>
