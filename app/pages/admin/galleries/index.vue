<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Galeries Photos</h1>
        <p class="admin-page-desc">Gérer les galeries photos des événements</p>
      </div>
      <NuxtLink to="/admin/galleries/new" class="btn btn--primary btn--sm">+ Créer une galerie</NuxtLink>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Événement</th>
            <th>Description</th>
            <th>Images</th>
            <th>Date de création</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending"><td colspan="5" class="empty-row">Chargement...</td></tr>
          <tr v-else-if="error"><td colspan="5" class="empty-row text-red-500">Erreur lors du chargement.</td></tr>
          <tr v-else-if="!galleries?.length"><td colspan="5" class="empty-row">Aucune galerie n'a encore été créée.</td></tr>
          <tr v-for="gallery in galleries" :key="gallery.id">
            <td data-label="Événement"><span class="event-title">{{ gallery.eventTitle || 'Sans titre' }}</span></td>
            <td data-label="Description"><span class="text-muted">{{ gallery.description || '-' }}</span></td>
            <td data-label="Images">
              <span class="type-badge">{{ gallery.images?.length || 0 }} image(s)</span>
            </td>
            <td data-label="Date"><span class="text-muted">{{ new Date(gallery.createdAt).toLocaleDateString('fr-FR') }}</span></td>
            <td data-label="Actions">
              <div class="action-btns" style="justify-content: flex-end;">
                <NuxtLink :to="`/admin/galleries/${gallery.id}/edit`" class="action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </NuxtLink>
                <button class="action-btn action-btn--danger" title="Supprimer" @click="deleteGallery(gallery.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
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

const { data: response, pending, error, refresh } = await useFetch<{ data: any[] }>('/api/admin/galleries')
const galleries = computed(() => response.value?.data || [])

async function deleteGallery(id: string) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette galerie ?')) return

  try {
    const res = await $fetch<{ success: boolean }>(`/api/admin/galleries/${id}`, { method: 'DELETE' })
    if (res.success) {
      alert('Galerie supprimée avec succès.')
      refresh()
    }
  } catch (err: any) {
    alert("Erreur lors de la suppression: " + (err.data?.message || err.message))
  }
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
.text-muted { color: var(--neutral-500); }
.empty-row { text-align: center; color: var(--neutral-400); padding: var(--space-10) !important; }
.event-title { font-weight: 500; color: var(--neutral-800); }
.type-badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: var(--radius-full); background: var(--neutral-100); color: var(--neutral-600); }
.action-btns { display: flex; gap: var(--space-2); }
.action-btn { width: 30px; height: 30px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--neutral-400); transition: all var(--transition-fast); }
.action-btn:hover { background: var(--neutral-100); color: var(--neutral-700); }
.action-btn--danger:hover { background: var(--red-50); color: var(--red-500); }
</style>
