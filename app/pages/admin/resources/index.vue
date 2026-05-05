<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Ressources</h1>
        <p class="admin-page-desc">Gérer les articles, vidéos et guides de la plateforme</p>
      </div>
      <NuxtLink to="/admin/resources/new" class="btn btn--primary btn--sm">+ Nouvelle ressource</NuxtLink>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Type</th>
            <th>Thème</th>
            <th>Statut</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in resourcesList" :key="r.id">
            <td><span class="resource-title">{{ r.title }}</span></td>
            <td><span class="type-badge">{{ r.type }}</span></td>
            <td class="text-muted">{{ r.theme }}</td>
            <td>
              <span class="status-pill" :class="r.isDraft ? 'status-pill--draft' : 'status-pill--published'">
                {{ r.isDraft ? 'Brouillon' : 'Publié' }}
              </span>
            </td>
            <td class="text-muted">{{ formatDate(r.createdAt) }}</td>
            <td>
              <div class="action-btns">
                <NuxtLink :to="`/admin/resources/${r.id}/edit`" class="action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </NuxtLink>
                <button class="action-btn" :title="r.isDraft ? 'Publier' : 'Dépublier'" @click="togglePublish(r)">
                  <svg v-if="r.isDraft" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <button class="action-btn action-btn--danger" title="Supprimer" @click="deleteResource(r.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!resourcesList?.length"><td colspan="6" class="empty-row">Aucune ressource. Créez la première !</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data: response, refresh } = await useFetch('/api/admin/resources')
const resourcesList = computed(() => response.value?.data ?? [])

async function togglePublish(r: any) {
  await $fetch(`/api/admin/resources/${r.id}`, { method: 'PATCH', body: { isDraft: !r.isDraft } })
  refresh()
}

async function deleteResource(id: string) {
  if (!confirm('Supprimer cette ressource ?')) return
  await $fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
  refresh()
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) }
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
.text-muted { color: var(--neutral-500); }
.empty-row { text-align: center; color: var(--neutral-400); padding: var(--space-10) !important; }

.resource-title { font-weight: 500; color: var(--neutral-800); }
.type-badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: var(--radius-full); background: var(--neutral-100); color: var(--neutral-600); text-transform: capitalize; }

.status-pill { font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: var(--radius-full); }
.status-pill--draft { background: #fef3c7; color: #92400e; }
.status-pill--published { background: var(--green-50); color: var(--green-600); }

.action-btns { display: flex; gap: var(--space-2); }
.action-btn { width: 30px; height: 30px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--neutral-400); transition: all var(--transition-fast); }
.action-btn:hover { background: var(--neutral-100); color: var(--neutral-700); }
.action-btn--danger:hover { background: var(--red-50); color: var(--red-500); }
</style>
