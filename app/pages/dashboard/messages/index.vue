<template>
  <div class="messages-page container">
    <header class="page-header">
      <h1>Mes Messages</h1>
      <p>Échangez avec vos {{ user?.status === 'mentor' ? 'mentorés' : 'mentors' }}.</p>
    </header>

    <div v-if="pending" class="loading-state">
      <span class="spinner"/> Chargement des conversations...
    </div>
    
    <div v-else-if="!conversations.length" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <h3>Aucune conversation active</h3>
      <p>Vous n'avez pas encore de conversation. Les discussions apparaîtront ici une fois qu'une demande de mentorat aura été acceptée.</p>
    </div>

    <div v-else class="conversations-list">
      <NuxtLink v-for="conv in conversations" :key="conv.id" :to="`/dashboard/messages/${conv.id}`" class="conversation-card">
        <div class="avatar" :style="{ background: getColor(conv.partnerName || '') }">{{ conv.partnerName?.[0]?.toUpperCase() || '?' }}</div>
        <div class="conv-details">
          <div class="conv-header">
            <h3>{{ conv.partnerName || 'Utilisateur inconnu' }}</h3>
            <span class="date">{{ formatDate(conv.lastMessageAt) }}</span>
          </div>
          <p class="last-message">{{ conv.lastMessage }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' } as any)
const { user } = useAuth()
const { data, pending } = useFetch<any>('/api/messages/conversations')
const conversations = computed(() => data.value?.data || [])

function formatDate(d: string) { 
  if (!d || new Date(d).getTime() === 0) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) 
}
function getColor(name: string) {
  const colors = ['#1B6B3A', '#D4A017', '#C7372F', '#3b82f6', '#8b5cf6']
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length]
}
</script>

<style scoped>
.messages-page { padding-top: var(--space-8); padding-bottom: var(--space-12); min-height: 80vh; }
.page-header { margin-bottom: var(--space-8); }
.page-header h1 { font-family: var(--font-serif); font-size: var(--text-3xl); color: var(--neutral-900); }
.page-header p { color: var(--neutral-500); }

.conversations-list { display: flex; flex-direction: column; gap: var(--space-3); max-width: 800px; }
.conversation-card { display: flex; gap: var(--space-4); align-items: center; padding: var(--space-4); background: white; border-radius: var(--radius-xl); border: 1px solid var(--neutral-200); text-decoration: none; color: inherit; transition: all var(--transition-fast); }
.conversation-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: var(--green-200); }

.avatar { width: 48px; height: 48px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: var(--text-lg); font-weight: 600; flex-shrink: 0; }
.conv-details { flex: 1; min-width: 0; }
.conv-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.conv-header h3 { font-weight: 600; font-size: var(--text-base); color: var(--neutral-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.date { font-size: var(--text-xs); color: var(--neutral-400); flex-shrink: 0; }
.last-message { font-size: var(--text-sm); color: var(--neutral-500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.empty-state { text-align: center; padding: var(--space-16); color: var(--neutral-500); background: white; border-radius: var(--radius-xl); border: 1px dashed var(--neutral-300); }
.empty-state svg { margin: 0 auto var(--space-4); color: var(--neutral-400); }
.loading-state { padding: var(--space-12) 0; text-align: center; color: var(--neutral-500); }
</style>
