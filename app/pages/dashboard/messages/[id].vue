<template>
  <div class="chat-page container">
    <div class="chat-container">
      <header class="chat-header">
        <NuxtLink to="/dashboard/messages" class="back-link">← Retour</NuxtLink>
        <div class="header-info">
          <h2>Conversation</h2>
          <button v-if="user?.status === 'mentor' && !isClosed" @click="closeMentorship" class="btn btn--warm btn--sm">Mettre fin à la relation</button>
          <span v-if="isClosed" class="badge badge--closed">Relation terminée</span>
        </div>
      </header>

      <div class="chat-messages" ref="messagesContainer">
        <div v-if="pending" class="loading-state">Chargement des messages...</div>
        <div v-else-if="!messages.length" class="empty-chat">
          <p>Aucun message. Envoyez le premier !</p>
        </div>
        
        <div v-for="msg in messages" :key="msg._id" class="message-wrapper" :class="{ 'mine': msg.senderId === user?.id }">
          <div class="message-bubble">
            <template v-if="msg.type === 'text'">
              <p>{{ msg.content }}</p>
            </template>
            <template v-else-if="msg.type === 'image'">
              <a :href="msg.mediaUrl" target="_blank">
                <img :src="msg.mediaUrl" alt="Image envoyée" class="message-image" />
              </a>
            </template>
            <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-if="!isClosed" class="chat-input-area">
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        
        <form @submit.prevent="sendMessage" class="input-form">
          <label class="image-upload-btn">
            📎
            <input type="file" accept="image/*" class="hidden" @change="uploadImage" :disabled="isUploading" />
          </label>
          <input v-model="newMessage" type="text" placeholder="Écrivez un message..." class="form-input chat-input" :disabled="isSending" />
          <button type="submit" class="btn btn--primary send-btn" :disabled="!newMessage.trim() || isSending">
            Envoyer
          </button>
        </form>
        <div v-if="isUploading" class="uploading-indicator">Envoi de l'image en cours...</div>
      </div>
      <div v-else class="closed-notice">
        Cette conversation est fermée. Vous ne pouvez plus envoyer de messages.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' } as any)
const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const mentorshipId = route.params.id as string

const { data, pending, error: fetchError, refresh } = useFetch<any>(`/api/messages/${mentorshipId}`)
const messages = computed(() => data.value?.data || [])
const isClosed = computed(() => fetchError.value?.statusCode === 403 && fetchError.value?.data?.message.includes('terminée'))

const newMessage = ref('')
const isSending = ref(false)
const isUploading = ref(false)
const errorMsg = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}

watch(messages, scrollToBottom, { deep: true })
onMounted(scrollToBottom)

async function sendMessage() {
  if (!newMessage.value.trim() || isSending.value) return
  errorMsg.value = ''
  isSending.value = true
  try {
    await $fetch<any>(`/api/messages/${mentorshipId}`, {
      method: 'POST',
      body: { type: 'text', content: newMessage.value }
    })
    newMessage.value = ''
    refresh()
  } catch (err: any) {
    errorMsg.value = err?.data?.message || 'Erreur lors de l\'envoi'
  } finally {
    isSending.value = false
  }
}

async function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  errorMsg.value = ''
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // Upload file
    const uploadRes = await $fetch<any>('/api/upload/image?folder=messages', {
      method: 'POST',
      body: formData
    })
    
    // Send message with image URL
    await $fetch<any>(`/api/messages/${mentorshipId}`, {
      method: 'POST',
      body: { type: 'image', mediaUrl: uploadRes.data.url }
    })
    
    refresh()
  } catch (err: any) {
    errorMsg.value = err?.data?.message || 'Erreur lors de l\'envoi de l\'image'
  } finally {
    isUploading.value = false
    target.value = ''
  }
}

async function closeMentorship() {
  if (!confirm('Voulez-vous vraiment clore cette relation ? Cette action est irréversible et fermera la discussion.')) return
  try {
    await $fetch<any>(`/api/messages/${mentorshipId}/close`, { method: 'POST' })
    refresh()
  } catch (err) {
    alert('Erreur lors de la fermeture de la relation.')
  }
}
</script>

<style scoped>
.chat-page { padding-top: var(--space-8); padding-bottom: var(--space-8); height: calc(100vh - 80px); display: flex; flex-direction: column; }
.chat-container { display: flex; flex-direction: column; background: white; border-radius: var(--radius-xl); border: 1px solid var(--neutral-200); height: 100%; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); max-width: 900px; margin: 0 auto; width: 100%; }

.chat-header { padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--neutral-200); background: var(--neutral-50); display: flex; flex-direction: column; gap: var(--space-2); }
.back-link { font-size: var(--text-sm); color: var(--neutral-500); font-weight: 500; text-decoration: none; }
.header-info { display: flex; justify-content: space-between; align-items: center; }
.header-info h2 { font-size: var(--text-lg); font-weight: 600; }
.badge--closed { background: var(--red-100); color: var(--red-700); font-size: 12px; padding: 2px 8px; border-radius: 12px; font-weight: 600; }

.chat-messages { flex: 1; overflow-y: auto; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); background: var(--neutral-50); }
.empty-chat { margin: auto; color: var(--neutral-400); font-style: italic; }

.message-wrapper { display: flex; justify-content: flex-start; }
.message-wrapper.mine { justify-content: flex-end; }

.message-bubble { max-width: 70%; background: white; padding: var(--space-3) var(--space-4); border-radius: 16px; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); position: relative; }
.message-wrapper.mine .message-bubble { background: var(--green-600); color: white; border-bottom-left-radius: 16px; border-bottom-right-radius: 4px; }

.message-bubble p { margin: 0; font-size: var(--text-sm); line-height: 1.5; white-space: pre-wrap; }
.message-image { max-width: 100%; max-height: 300px; border-radius: 8px; display: block; margin-bottom: 4px; }
.message-time { display: block; font-size: 10px; color: var(--neutral-400); text-align: right; margin-top: 4px; }
.message-wrapper.mine .message-time { color: rgba(255,255,255,0.7); }

.chat-input-area { padding: var(--space-4); background: white; border-top: 1px solid var(--neutral-200); }
.input-form { display: flex; gap: var(--space-2); align-items: center; }
.chat-input { flex: 1; border-radius: 24px; padding: 12px 16px; background: var(--neutral-100); border: none; }
.chat-input:focus { background: var(--neutral-50); outline: 2px solid var(--green-200); }
.send-btn { border-radius: 24px; padding: 8px 20px; }

.image-upload-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: var(--neutral-100); cursor: pointer; transition: background 0.2s; font-size: 20px; }
.image-upload-btn:hover { background: var(--neutral-200); }
.hidden { display: none; }
.uploading-indicator { font-size: 12px; color: var(--neutral-500); margin-top: 8px; text-align: center; }
.error-msg { font-size: 12px; color: var(--red-600); margin-bottom: 8px; text-align: center; }
.closed-notice { padding: var(--space-4); text-align: center; color: var(--neutral-500); background: var(--neutral-100); font-size: var(--text-sm); font-style: italic; }
</style>
