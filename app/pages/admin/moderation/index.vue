<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Modération</h1>
        <p class="admin-page-desc">{{ reports.length }} post(s) signalé(s) en attente de modération</p>
      </div>
    </div>

    <div class="reports-list">
      <div v-for="report in reports" :key="report.id" class="report-card">
        <div class="report-card__header">
          <div class="report-card__user">
            <div class="report-card__avatar" :style="{ background: getColor(report.authorName) }">{{ report.authorName?.[0]?.toUpperCase() }}</div>
            <div>
              <span class="report-card__name">{{ report.authorName }}</span>
              <span class="report-card__email">{{ report.authorEmail }}</span>
            </div>
          </div>
          <div class="report-card__meta">
            <span class="report-card__flag">🚩 Signalé</span>
            <span class="report-card__date">{{ formatDate(report.flaggedAt || report.createdAt) }}</span>
          </div>
        </div>

        <div class="report-card__thread">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {{ report.threadTitle }}
        </div>

        <div class="report-card__content">
          <p>{{ report.content }}</p>
        </div>

        <div class="report-card__actions">
          <button class="btn btn--outline btn--sm" @click="moderate(report.id, 'dismiss')">Ignorer le signalement</button>
          <button class="btn btn--warm btn--sm" @click="moderate(report.id, 'delete_post')">Supprimer le post</button>
          <button class="btn btn--warm btn--sm" style="background: var(--neutral-800)" @click="moderate(report.id, 'suspend_user')">Suspendre l'utilisateur</button>
        </div>
      </div>

      <div v-if="!reports.length" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <h3>Tout est en ordre</h3>
        <p>Aucun post signalé en attente de modération.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data: response, refresh } = await useFetch('/api/admin/reports')
const reports = computed(() => response.value?.data ?? [])

async function moderate(id: string, action: string) {
  const labels: Record<string, string> = {
    dismiss: 'Ignorer ce signalement ?',
    delete_post: 'Supprimer ce post ? Cette action est irréversible.',
    suspend_user: 'Suspendre cet utilisateur ET supprimer le post ? Cette action est irréversible.',
  }
  if (!confirm(labels[action])) return
  await $fetch(`/api/admin/reports/${id}`, { method: 'PATCH', body: { action } })
  refresh()
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
function getColor(name: string) {
  const colors = ['#1B6B3A', '#D4A017', '#C7372F', '#3b82f6', '#8b5cf6']
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length]
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }

.reports-list { display: flex; flex-direction: column; gap: var(--space-4); }

.report-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); border-left: 4px solid var(--red-400); }

.report-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); }
.report-card__user { display: flex; align-items: center; gap: var(--space-3); }
.report-card__avatar { width: 36px; height: 36px; border-radius: var(--radius-full); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: var(--text-sm); flex-shrink: 0; }
.report-card__name { display: block; font-weight: 600; font-size: var(--text-sm); color: var(--neutral-900); }
.report-card__email { font-size: var(--text-xs); color: var(--neutral-400); }

.report-card__meta { text-align: right; }
.report-card__flag { display: block; font-size: var(--text-xs); font-weight: 600; color: var(--red-500); margin-bottom: 2px; }
.report-card__date { font-size: var(--text-xs); color: var(--neutral-400); }

.report-card__thread { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--neutral-500); margin-bottom: var(--space-3); padding: var(--space-2) var(--space-3); background: var(--neutral-50); border-radius: var(--radius-md); }

.report-card__content { padding: var(--space-4); background: var(--red-50); border-radius: var(--radius-md); margin-bottom: var(--space-4); }
.report-card__content p { font-size: var(--text-sm); color: var(--neutral-700); line-height: 1.6; }

.report-card__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.empty-state { text-align: center; padding: var(--space-16); color: var(--neutral-400); }
.empty-state svg { margin: 0 auto var(--space-4); }
.empty-state h3 { font-size: var(--text-lg); font-weight: 600; color: var(--neutral-600); margin-bottom: var(--space-2); }
.empty-state p { font-size: var(--text-sm); }
</style>
