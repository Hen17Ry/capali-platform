<template>
  <div>
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Utilisateurs</h1>
        <p class="admin-page-desc">Gérer les {{ meta?.total ?? 0 }} utilisateurs de la plateforme</p>
      </div>
    </div>

    <!-- Search -->
    <div class="admin-toolbar">
      <div class="admin-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Rechercher par nom ou email..." class="admin-search__input" @input="debouncedSearch" >
      </div>
    </div>

    <!-- Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Statut</th>
            <th>Rôle</th>
            <th>Inscrit le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersList" :key="user.id">
            <td data-label="Utilisateur">
              <div class="user-cell">
                <div class="user-cell__avatar" :style="{ background: getAvatarColor(user.name) }">{{ user.name?.[0]?.toUpperCase() ?? '?' }}</div>
                <span class="user-cell__name">{{ user.name ?? 'Sans nom' }}</span>
              </div>
            </td>
            <td data-label="Email" class="text-muted">{{ user.email }}</td>
            <td data-label="Statut"><span class="status-badge" :class="`status-badge--${user.status}`">{{ user.status }}</span></td>
            <td data-label="Rôle"><span v-if="user.isAdmin" class="role-badge">Admin</span><span v-else class="text-muted">—</span></td>
            <td data-label="Inscrit le" class="text-muted">{{ formatDate(user.createdAt) }}</td>
            <td data-label="Actions">
              <div class="action-btns">
                <NuxtLink :to="`/admin/users/${user.id}`" class="action-btn" title="Voir">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </NuxtLink>
                <button class="action-btn action-btn--danger" title="Suspendre" @click="suspendUser(user.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!usersList?.length">
            <td colspan="6" class="empty-row">Aucun utilisateur trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="meta && (meta.totalPages ?? 0) > 1" class="admin-pagination">
      <button :disabled="page <= 1" class="admin-pagination__btn" @click="page--">← Précédent</button>
      <span class="admin-pagination__info">Page {{ page }} / {{ meta.totalPages ?? 1 }}</span>
      <button :disabled="page >= (meta.totalPages ?? 1)" class="admin-pagination__btn" @click="page++">Suivant →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const searchQuery = ref('')
const page = ref(1)
let debounceTimer: ReturnType<typeof setTimeout>

const { data: response, refresh } = await useFetch('/api/admin/users', {
  query: computed(() => ({ search: searchQuery.value, page: page.value, perPage: 20 })),
})

const usersList = computed(() => response.value?.data ?? [])
const meta = computed(() => response.value?.meta)

function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; refresh() }, 300)
}

watch(page, () => refresh())

async function suspendUser(id: string) {
  if (!confirm('Suspendre cet utilisateur ?')) return
  await $fetch(`/api/admin/users/${id}`, { method: 'PATCH', body: { action: 'suspend' } })
  refresh()
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getAvatarColor(name: string) {
  const colors = ['#1B6B3A', '#D4A017', '#C7372F', '#3b82f6', '#8b5cf6', '#ec4899']
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length
  return colors[idx]
}
</script>

<style scoped>
.admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }

.admin-toolbar { display: flex; gap: var(--space-3); margin-bottom: var(--space-6); }
.admin-search { display: flex; align-items: center; gap: var(--space-2); background: var(--neutral-0); border: 1px solid var(--neutral-200); border-radius: var(--radius-lg); padding: var(--space-2) var(--space-4); flex: 1; max-width: 400px; color: var(--neutral-400); }
.admin-search:focus-within { border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.admin-search__input { border: none; outline: none; background: none; font-size: var(--text-sm); color: var(--neutral-800); width: 100%; }

.admin-table-wrap { background: var(--neutral-0); border-radius: var(--radius-xl); border: 1px solid var(--neutral-100); overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--neutral-500); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--neutral-100); background: var(--neutral-50); }
.admin-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--neutral-50); font-size: var(--text-sm); }
.admin-table tr:hover td { background: #fafbfc; }
.text-muted { color: var(--neutral-500); }
.empty-row { text-align: center; color: var(--neutral-400); padding: var(--space-10) !important; }

.user-cell { display: flex; align-items: center; gap: var(--space-3); }
.user-cell__avatar { width: 32px; height: 32px; border-radius: var(--radius-full); color: white; display: flex; align-items: center; justify-content: center; font-size: var(--text-sm); font-weight: 600; flex-shrink: 0; }
.user-cell__name { font-weight: 500; color: var(--neutral-800); }

.status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full); text-transform: capitalize; }
.status-badge--active { background: var(--green-50); color: var(--green-600); }
.status-badge--mentor { background: var(--gold-50); color: var(--gold-700); }
.status-badge--pending { background: #fef3c7; color: #92400e; }
.status-badge--suspended { background: var(--red-50); color: var(--red-600); }

.role-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full); background: #ede9fe; color: #7c3aed; }

.action-btns { display: flex; gap: var(--space-2); }
.action-btn { width: 30px; height: 30px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--neutral-400); transition: all var(--transition-fast); }
.action-btn:hover { background: var(--neutral-100); color: var(--neutral-700); }
.action-btn--danger:hover { background: var(--red-50); color: var(--red-500); }

.admin-pagination { display: flex; align-items: center; justify-content: center; gap: var(--space-4); margin-top: var(--space-6); }
.admin-pagination__btn { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); font-weight: 500; color: var(--neutral-600); background: var(--neutral-0); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); transition: all var(--transition-fast); }
.admin-pagination__btn:hover:not(:disabled) { border-color: var(--green-400); color: var(--green-600); }
.admin-pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.admin-pagination__info { font-size: var(--text-sm); color: var(--neutral-500); }

@media (max-width: 640px) { .admin-search { max-width: 100%; } }
</style>
