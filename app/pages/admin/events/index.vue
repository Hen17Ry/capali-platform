<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Événements</h1>
        <p class="admin-page-desc">Gérer les événements de la communauté</p>
      </div>
      <NuxtLink to="/admin/events/new" class="btn btn--primary btn--sm">+ Nouvel événement</NuxtLink>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Type</th>
            <th>Ville</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in eventsList" :key="e.id" :class="{ 'row--past': isPast(e.eventDate) }">
            <td data-label="Titre"><span class="event-title">{{ e.title }}</span></td>
            <td data-label="Type"><span class="type-badge" :class="`type-badge--${e.type}`">{{ e.type }}</span></td>
            <td data-label="Ville" class="text-muted">{{ e.city ?? 'En ligne' }}</td>
            <td data-label="Date" :class="isPast(e.eventDate) ? 'text-muted' : ''">{{ formatDate(e.eventDate) }}</td>
            <td data-label="Actions">
              <div class="action-btns">
                <NuxtLink :to="`/admin/events/${e.id}/edit`" class="action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </NuxtLink>
                <button class="action-btn action-btn--danger" title="Supprimer" @click="deleteEvent(e.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!eventsList?.length"><td colspan="5" class="empty-row">Aucun événement. Créez le premier !</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data: response, refresh } = await useFetch('/api/admin/events')
const eventsList = computed(() => response.value?.data ?? [])

function isPast(d: string) { return new Date(d) < new Date() }
function formatDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }

async function deleteEvent(id: string) {
  if (!confirm('Supprimer cet événement ?')) return
  await $fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<style scoped>
.admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }
.admin-table-wrap { background: var(--neutral-0); border-radius: var(--radius-xl); border: 1px solid var(--neutral-100); overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--neutral-500); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--neutral-100); background: var(--neutral-50); }
.admin-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--neutral-50); font-size: var(--text-sm); }
.admin-table tr:hover td { background: #fafbfc; }
.row--past { opacity: 0.5; }
.text-muted { color: var(--neutral-500); }
.empty-row { text-align: center; color: var(--neutral-400); padding: var(--space-10) !important; }
.event-title { font-weight: 500; color: var(--neutral-800); }
.type-badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: var(--radius-full); text-transform: capitalize; background: var(--neutral-100); color: var(--neutral-600); }
.type-badge--workshop { background: #ede9fe; color: #7c3aed; }
.type-badge--networking { background: #dbeafe; color: #2563eb; }
.type-badge--webinar { background: var(--gold-50); color: var(--gold-700); }
.action-btns { display: flex; gap: var(--space-2); }
.action-btn { width: 30px; height: 30px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--neutral-400); transition: all var(--transition-fast); }
.action-btn:hover { background: var(--neutral-100); color: var(--neutral-700); }
.action-btn--danger:hover { background: var(--red-50); color: var(--red-500); }
</style>
