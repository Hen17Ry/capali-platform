<template>
  <div class="forum-page">
    <header class="forum-header">
      <div class="container">
        <h1>Forum Communautaire</h1>
        <p>Échangez, posez vos questions et partagez vos expériences avec la communauté CAP ALI.</p>
        <button v-if="isAuthenticated" class="btn btn--primary" @click="showCreateModal = true">
          + Nouvelle Discussion
        </button>
        <div v-else class="auth-notice">
          <NuxtLink to="/auth/login">Connectez-vous</NuxtLink> pour participer au forum.
        </div>
      </div>
    </header>

    <div class="container forum-container">
      <aside class="forum-sidebar">
        <h3>Catégories</h3>
        <ul class="category-list">
          <li v-for="cat in categories" :key="cat">
            <button 
              class="category-btn" 
              :class="{ active: selectedCategory === cat }"
              @click="setCategory(cat)"
            >
              {{ cat }}
            </button>
          </li>
        </ul>
      </aside>

      <main class="forum-main">
        <div class="forum-filters">
          <input type="text" v-model="searchQuery" placeholder="Rechercher une discussion..." class="form-input search-input" />
          <select v-model="sortBy" class="form-select sort-select">
            <option value="newest">Plus récents</option>
            <option value="popular">Plus populaires</option>
          </select>
        </div>

        <div v-if="pending" class="loading-state">
          <span class="spinner"></span> Chargement des discussions...
        </div>
        <div v-else-if="error" class="error-state">
          Erreur lors du chargement des discussions.
        </div>
        <div v-else-if="threads.length === 0" class="empty-state">
          Aucune discussion trouvée dans cette catégorie.
        </div>
        <div v-else class="thread-list">
          <NuxtLink v-for="thread in threads" :key="thread._id" :to="`/forum/${thread._id}`" class="thread-card">
            <div class="thread-main">
              <span v-if="thread.isPinned" class="badge badge--pinned">📌 Épinglé</span>
              <span class="badge badge--category">{{ thread.category }}</span>
              <h3 class="thread-title">{{ thread.title }}</h3>
              <p class="thread-meta">
                Par <strong>{{ thread.authorName }}</strong> • Dernière activité {{ formatDate(thread.lastActivityAt) }}
              </p>
              <div class="thread-tags" v-if="thread.tags && thread.tags.length">
                <span v-for="tag in thread.tags" :key="tag" class="tag">#{{ tag }}</span>
              </div>
            </div>
            <div class="thread-stats">
              <div class="stat">
                <span>👁️</span> {{ thread.viewCount }}
              </div>
              <div class="stat">
                <span>💬</span> {{ thread.replyCount }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </main>
    </div>

    <!-- Modal Create Thread -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h2>Créer une discussion</h2>
        <form @submit.prevent="createThread" class="form">
          <div class="form-group">
            <label>Titre *</label>
            <input v-model="newThread.title" type="text" required class="form-input" placeholder="Titre de votre discussion" minlength="5" maxlength="150" />
          </div>
          <div class="form-group">
            <label>Catégorie *</label>
            <select v-model="newThread.category" required class="form-select">
              <option v-for="cat in categories.filter(c => c !== 'Tous')" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Contenu *</label>
            <textarea v-model="newThread.content" required class="form-textarea" rows="6" placeholder="Posez votre question ou partagez votre expérience..."></textarea>
          </div>
          <div class="form-group">
            <label>Tags (séparés par des virgules)</label>
            <input v-model="newThread.tags" type="text" class="form-input" placeholder="Ex: logement, crous, garants" />
          </div>
          
          <div v-if="createError" class="auth-alert auth-alert--error">{{ createError }}</div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn--outline" @click="showCreateModal = false">Annuler</button>
            <button type="submit" class="btn btn--primary" :disabled="isCreating">
              {{ isCreating ? 'Publication...' : 'Publier' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
const router = useRouter()

const categories = ['Tous', 'Général', 'Logement', 'Études', 'Emploi & Stages', 'Démarches Administratives', 'Vie Quotidienne', 'Événements']
const selectedCategory = ref('Tous')
const searchQuery = ref('')
const sortBy = ref('newest')

const showCreateModal = ref(false)
const isCreating = ref(false)
const createError = ref('')
const newThread = reactive({
  title: '',
  category: 'Général',
  content: '',
  tags: ''
})

// Fetch threads
const queryParams = computed(() => ({
  category: selectedCategory.value,
  search: searchQuery.value,
  sort: sortBy.value
}))

const { data, pending, error, refresh } = useFetch('/api/forum/threads', {
  query: queryParams,
  watch: [queryParams]
})

const threads = computed(() => data.value?.data || [])

// Methods
function setCategory(cat: string) {
  selectedCategory.value = cat
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function createThread() {
  createError.value = ''
  isCreating.value = true
  
  try {
    const tagsArray = newThread.tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await $fetch<{ data: { _id: string } }>('/api/forum/threads', {
      method: 'POST',
      body: {
        title: newThread.title,
        category: newThread.category,
        content: newThread.content,
        tags: tagsArray
      }
    })
    
    showCreateModal.value = false
    newThread.title = ''
    newThread.content = ''
    newThread.tags = ''
    
    if (res.data && res.data._id) {
      router.push(`/forum/${res.data._id}`)
    } else {
      refresh()
    }
  } catch (err: any) {
    createError.value = err?.data?.message || 'Erreur lors de la création de la discussion.'
  } finally {
    isCreating.value = false
  }
}
</script>

<style scoped>
.forum-page {
  min-height: 100vh;
  background: var(--neutral-50);
}

.forum-header {
  background: linear-gradient(135deg, var(--green-700), var(--green-600));
  color: white;
  padding: var(--space-10) 0;
  text-align: center;
}

.forum-header h1 {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
}

.forum-header p {
  font-size: var(--text-lg);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto var(--space-6);
}

.auth-notice {
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}
.auth-notice a { color: var(--gold-400); font-weight: bold; text-decoration: underline; }

.forum-container {
  display: flex;
  gap: var(--space-8);
  padding-top: var(--space-8);
  padding-bottom: var(--space-12);
}

.forum-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.forum-sidebar h3 {
  font-size: var(--text-sm);
  text-transform: uppercase;
  color: var(--neutral-500);
  margin-bottom: var(--space-4);
  letter-spacing: 1px;
}

.category-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.category-btn {
  width: 100%;
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: var(--neutral-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-btn:hover {
  background: var(--neutral-100);
}

.category-btn.active {
  background: var(--green-50);
  color: var(--green-700);
  font-weight: 600;
}

.forum-main {
  flex: 1;
}

.forum-filters {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.search-input { flex: 1; }
.sort-select { width: 200px; }

.thread-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.thread-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--neutral-200);
}

.thread-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: var(--green-200);
}

.thread-main { flex: 1; }

.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin-bottom: var(--space-2);
  margin-right: var(--space-2);
}
.badge--category { background: var(--neutral-100); color: var(--neutral-600); }
.badge--pinned { background: var(--gold-100); color: var(--gold-700); }

.thread-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: var(--space-1);
}

.thread-meta {
  font-size: var(--text-sm);
  color: var(--neutral-500);
  margin-bottom: var(--space-2);
}

.thread-tags { display: flex; gap: var(--space-2); }
.tag { font-size: 11px; color: var(--green-600); background: var(--green-50); padding: 2px 6px; border-radius: 4px; }

.thread-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: right;
  min-width: 60px;
}
.stat { font-size: var(--text-sm); color: var(--neutral-500); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; padding: var(--space-8); border-radius: var(--radius-xl); width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal-content h2 { font-family: var(--font-serif); margin-bottom: var(--space-6); color: var(--neutral-900); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-group label { font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); }
.form-input, .form-select, .form-textarea { padding: var(--space-3); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); font-family: inherit; }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--green-500); }
.form-textarea { resize: vertical; }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-4); }
.auth-alert { padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--text-sm); background: var(--red-50); color: var(--red-600); border: 1px solid rgba(220,38,38,0.2); }

@media (max-width: 768px) {
  .forum-container { flex-direction: column; }
  .forum-sidebar { width: 100%; }
  .category-list { flex-direction: row; flex-wrap: wrap; }
  .category-btn { width: auto; }
  .forum-filters { flex-direction: column; }
  .sort-select { width: 100%; }
}
</style>
