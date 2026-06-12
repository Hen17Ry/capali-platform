<template>
  <div>
    <div class="admin-page-header">
      <NuxtLink to="/admin/messages" class="back-link">← Retour</NuxtLink>
      <div>
        <h1 class="admin-page-title">Lecture de la conversation</h1>
        <p class="admin-page-desc">Vue restreinte en lecture seule pour la modération.</p>
      </div>
    </div>

    <div class="chat-container">
      <div v-if="pending" class="loading-state">Chargement des messages...</div>
      <div v-else-if="!messages.length" class="empty-state">
        <p>Cette conversation est vide.</p>
      </div>
      <div v-else class="chat-messages">
        <div v-for="msg in messages" :key="msg._id" class="message-wrapper">
          <div class="message-bubble">
            <span class="message-author">ID Auteur: {{ msg.senderId }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()
const { data, pending } = useFetch<any>(`/api/messages/${route.params.id}`)
const messages = computed(() => data.value?.data || [])

function formatTime(d: string) {
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.back-link { display: inline-block; color: var(--neutral-500); text-decoration: none; font-weight: 500; margin-bottom: var(--space-4); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }

.chat-container { background: white; border-radius: var(--radius-xl); border: 1px solid var(--neutral-200); padding: var(--space-6); min-height: 50vh; }
.chat-messages { display: flex; flex-direction: column; gap: var(--space-4); }
.message-wrapper { display: flex; flex-direction: column; align-items: flex-start; }
.message-bubble { max-width: 80%; background: var(--neutral-50); padding: var(--space-3) var(--space-4); border-radius: 8px; border: 1px solid var(--neutral-200); }
.message-author { display: block; font-size: 10px; font-weight: 600; color: var(--neutral-500); margin-bottom: 4px; }
.message-bubble p { margin: 0; font-size: var(--text-sm); line-height: 1.5; white-space: pre-wrap; color: var(--neutral-800); }
.message-image { max-width: 100%; max-height: 300px; border-radius: 4px; margin-top: 8px; }
.message-time { display: block; font-size: 10px; color: var(--neutral-400); text-align: right; margin-top: 8px; }

.loading-state, .empty-state { text-align: center; color: var(--neutral-500); padding: var(--space-8); }
</style>
