<template>
  <div v-if="!pending && threadData" class="thread-page">
    <div class="container">
      <NuxtLink to="/forum" class="back-link">← Retour au forum</NuxtLink>
      
      <div class="thread-header">
        <span class="badge">{{ threadData.thread.category }}</span>
        <h1 class="title">{{ threadData.thread.title }}</h1>
        <div class="meta">
          <span>Par <strong>{{ threadData.thread.authorName }}</strong></span>
          <span class="dot">•</span>
          <span>{{ formatDate(threadData.thread.createdAt) }}</span>
          <span class="dot">•</span>
          <span>👁️ {{ threadData.thread.viewCount }} vues</span>
        </div>
        <div v-if="threadData.thread.tags?.length" class="tags">
          <span v-for="tag in threadData.thread.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>

      <div class="post original-post">
        <div v-if="editingThread" class="edit-form">
          <input v-model="editThreadData.title" class="form-input mb-2" >
          <textarea v-model="editThreadData.content" class="form-textarea mb-2" rows="4"/>
          <div class="flex-actions">
            <button class="btn btn--outline btn--sm" @click="editingThread = false">Annuler</button>
            <button class="btn btn--primary btn--sm" @click="saveThreadEdit">Sauvegarder</button>
          </div>
        </div>
        <div v-else class="post-content">{{ threadData.thread.content }}</div>
        
        <div v-if="isAuthenticated" class="post-actions mt-4">
          <button v-if="isAuthor(threadData.thread.authorId) || isAdmin" class="action-btn" @click="startEditThread">✏️ Modifier</button>
          <button v-if="isAuthor(threadData.thread.authorId) || isAdmin" class="action-btn text-red" @click="deleteThread">🗑️ Supprimer</button>
          <button v-if="!isAuthor(threadData.thread.authorId)" class="action-btn" @click="openReportModal('thread', threadData.thread._id)">🚩 Signaler</button>
        </div>
      </div>

      <div class="replies-section">
        <h3>{{ threadData.posts.length }} Réponses</h3>
        
        <div v-if="threadData.posts.length > 0" class="post-list">
          <div v-for="post in threadData.posts" :key="post._id" class="post reply-post">
            <div class="post-meta">
              <strong>{{ post.authorName }}</strong>
              <span class="date">{{ formatDate(post.createdAt) }}</span>
            </div>
            
            <div v-if="editingPostId === post._id" class="edit-form">
              <textarea v-model="editPostContent" class="form-textarea mb-2" rows="3"/>
              <div class="flex-actions">
                <button class="btn btn--outline btn--sm" @click="editingPostId = null">Annuler</button>
                <button class="btn btn--primary btn--sm" @click="savePostEdit(post._id)">Sauvegarder</button>
              </div>
            </div>
            <div v-else class="post-content">{{ post.content }}</div>

            <div v-if="isAuthenticated && editingPostId !== post._id" class="post-actions mt-3">
              <button v-if="isAuthor(post.authorId) || isAdmin" class="action-btn" @click="startEditPost(post)">✏️ Modifier</button>
              <button v-if="isAuthor(post.authorId) || isAdmin" class="action-btn text-red" @click="deletePost(post._id)">🗑️ Supprimer</button>
              <button v-if="!isAuthor(post.authorId)" class="action-btn" @click="openReportModal('post', post._id)">🚩 Signaler</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-replies">
          Soyez le premier à répondre !
        </div>

        <div v-if="isAuthenticated && !threadData.thread.isClosed" class="reply-form-container">
          <h4>Ajouter une réponse</h4>
          <div v-if="replyError" class="auth-alert auth-alert--error">{{ replyError }}</div>
          <form @submit.prevent="submitReply">
            <textarea v-model="replyContent" required rows="4" class="form-textarea" placeholder="Votre réponse..."/>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary" :disabled="isReplying">
                {{ isReplying ? 'Envoi...' : 'Répondre' }}
              </button>
            </div>
          </form>
        </div>
        <div v-else-if="threadData.thread.isClosed" class="closed-notice">
          Cette discussion a été fermée par un administrateur.
        </div>
        <div v-else class="auth-notice">
          <NuxtLink to="/auth/login">Connectez-vous</NuxtLink> pour répondre.
        </div>
      </div>
    </div>

    <!-- Modal Report -->
    <div v-if="reportModal.isOpen" class="modal-overlay" @click.self="reportModal.isOpen = false">
      <div class="modal-content">
        <h2>Signaler ce contenu</h2>
        <p class="mb-4 text-sm text-gray">Veuillez indiquer la raison du signalement. Un administrateur l'examinera rapidement.</p>
        <textarea v-model="reportModal.reason" rows="4" class="form-textarea mb-4" placeholder="Raison du signalement (spam, insultes, hors-sujet...)"/>
        <div class="modal-actions">
          <button class="btn btn--outline" @click="reportModal.isOpen = false">Annuler</button>
          <button class="btn btn--primary" :disabled="!reportModal.reason.trim()" @click="submitReport">Envoyer</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container loading-state">
    <span v-if="pending" class="spinner"/>
    <span v-if="error">Erreur lors du chargement de la discussion.</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const threadId = route.params.id as string
const { isAuthenticated, user, isAdmin } = useAuth()

const { data, pending, error, refresh } = useFetch(`/api/forum/threads/${threadId}`)
const threadData = computed(() => data.value?.data as any)

const replyContent = ref('')
const isReplying = ref(false)
const replyError = ref('')

// Editing state
const editingThread = ref(false)
const editThreadData = reactive({ title: '', content: '' })
const editingPostId = ref<string | null>(null)
const editPostContent = ref('')

// Report state
const reportModal = reactive({ isOpen: false, type: 'thread' as 'thread'|'post', targetId: '', reason: '' })

function isAuthor(authorId: string) {
  return user.value?.id === authorId
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function submitReply() {
  replyError.value = ''
  isReplying.value = true
  
  try {
    await $fetch(`/api/forum/threads/${threadId}/posts`, {
      method: 'POST',
      body: { content: replyContent.value }
    })
    
    replyContent.value = ''
    refresh()
  } catch (err: any) {
    replyError.value = err?.data?.message || 'Erreur lors de l\'envoi de la réponse.'
  } finally {
    isReplying.value = false
  }
}

// Actions Thread
function startEditThread() {
  editThreadData.title = threadData.value.thread.title
  editThreadData.content = threadData.value.thread.content
  editingThread.value = true
}

async function saveThreadEdit() {
  await $fetch(`/api/forum/threads/${threadId}`, {
    method: 'PUT',
    body: editThreadData
  })
  editingThread.value = false
  refresh()
}

async function deleteThread() {
  if (!confirm('Voulez-vous vraiment supprimer cette discussion ? Cette action est irréversible.')) return
  await $fetch(`/api/forum/threads/${threadId}`, { method: 'DELETE' })
  router.push('/forum')
}

// Actions Post
function startEditPost(post: any) {
  editingPostId.value = post._id
  editPostContent.value = post.content
}

async function savePostEdit(postId: string) {
  await $fetch(`/api/forum/posts/${postId}`, {
    method: 'PUT',
    body: { content: editPostContent.value }
  })
  editingPostId.value = null
  refresh()
}

async function deletePost(postId: string) {
  if (!confirm('Voulez-vous supprimer ce commentaire ?')) return
  await $fetch(`/api/forum/posts/${postId}`, { method: 'DELETE' })
  refresh()
}

// Reporting
function openReportModal(type: 'thread'|'post', id: string) {
  reportModal.type = type
  reportModal.targetId = id
  reportModal.reason = ''
  reportModal.isOpen = true
}

async function submitReport() {
  await $fetch('/api/forum/report', {
    method: 'POST',
    body: { targetType: reportModal.type, targetId: reportModal.targetId, reason: reportModal.reason }
  })
  reportModal.isOpen = false
  alert('Merci. Le signalement a été envoyé aux administrateurs.')
}
</script>

<style scoped>
.thread-page {
  padding: var(--space-8) 0;
  min-height: 100vh;
  background: var(--neutral-50);
}

.back-link {
  display: inline-block;
  color: var(--neutral-500);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: var(--space-6);
  transition: color var(--transition-fast);
}
.back-link:hover { color: var(--green-600); }

.thread-header { margin-bottom: var(--space-6); }
.badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px; background: var(--green-100); color: var(--green-800); margin-bottom: var(--space-3); }
.title { font-family: var(--font-serif); font-size: var(--text-3xl); color: var(--neutral-900); margin-bottom: var(--space-3); line-height: 1.2; }
.meta { display: flex; align-items: center; gap: var(--space-2); color: var(--neutral-500); font-size: var(--text-sm); margin-bottom: var(--space-3); }
.dot { font-size: 10px; }
.tags { display: flex; gap: var(--space-2); }
.tag { font-size: 12px; color: var(--neutral-600); background: var(--neutral-200); padding: 2px 8px; border-radius: 4px; }

.post { background: white; border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: 0 2px 12px rgba(0,0,0,0.03); margin-bottom: var(--space-6); }
.original-post { border-left: 4px solid var(--green-500); }
.post-content { white-space: pre-wrap; line-height: 1.6; color: var(--neutral-800); font-size: var(--text-base); }

.replies-section h3 { font-size: var(--text-xl); margin-bottom: var(--space-6); color: var(--neutral-800); padding-bottom: var(--space-2); border-bottom: 1px solid var(--neutral-200); }
.post-list { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-8); }
.reply-post { padding: var(--space-5); }
.post-meta { display: flex; justify-content: space-between; margin-bottom: var(--space-3); font-size: var(--text-sm); }
.post-meta strong { color: var(--neutral-900); }
.post-meta .date { color: var(--neutral-400); }

.empty-replies { text-align: center; color: var(--neutral-500); padding: var(--space-8) 0; font-style: italic; }

.reply-form-container { background: white; padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--neutral-200); }
.reply-form-container h4 { margin-bottom: var(--space-4); }
.form-textarea { width: 100%; padding: var(--space-3); border: 1px solid var(--neutral-300); border-radius: var(--radius-md); font-family: inherit; margin-bottom: var(--space-4); resize: vertical; }
.form-textarea:focus { outline: none; border-color: var(--green-500); }
.form-actions { text-align: right; }
.auth-alert { padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--text-sm); background: var(--red-50); color: var(--red-600); margin-bottom: var(--space-4); }
.auth-notice, .closed-notice { text-align: center; padding: var(--space-6); background: var(--neutral-100); border-radius: var(--radius-md); color: var(--neutral-600); }
.auth-notice a { color: var(--green-600); font-weight: bold; }

.post-actions { display: flex; gap: var(--space-4); align-items: center; border-top: 1px solid var(--neutral-100); padding-top: var(--space-3); }
.action-btn { background: none; border: none; font-size: 13px; color: var(--neutral-500); cursor: pointer; transition: color 0.2s; font-weight: 500; }
.action-btn:hover { color: var(--green-600); }
.action-btn.text-red:hover { color: var(--red-600); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.text-sm { font-size: var(--text-sm); }
.text-gray { color: var(--neutral-500); }
.flex-actions { display: flex; gap: var(--space-2); justify-content: flex-end; }
.btn--sm { padding: 4px 12px; font-size: 13px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; padding: var(--space-8); border-radius: var(--radius-xl); width: 100%; max-width: 500px; }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--space-3); }

.loading-state { padding: var(--space-12) 0; text-align: center; color: var(--neutral-500); }
</style>
