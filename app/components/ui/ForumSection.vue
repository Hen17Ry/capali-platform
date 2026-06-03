<template>
  <section id="forum" class="section section--light forum">
    <div class="container">
      <div class="forum__header reveal">
        <span class="section__overtitle">{{ $t('forum.overtitle') }}</span>
        <h2 class="section__title">{{ $t('forum.title') }}</h2>
        <p class="section__description">{{ $t('forum.description') }}</p>
      </div>
      <div v-if="pending" class="forum__loading">
        Chargement des discussions...
      </div>
      <div v-else-if="threads && threads.length > 0" class="forum__threads reveal">
        <div class="thread-grid">
          <NuxtLink v-for="thread in threads" :key="thread._id" :to="`/forum/${thread._id}`" class="thread-card">
            <span class="badge">{{ thread.category }}</span>
            <h3 class="thread-title">{{ thread.title }}</h3>
            <p class="thread-meta">Par {{ thread.authorName }} • 👁️ {{ thread.viewCount }}</p>
          </NuxtLink>
        </div>
        <div class="forum__actions">
          <NuxtLink to="/forum" class="btn btn--primary">{{ $t('forum.cta') }}</NuxtLink>
        </div>
      </div>
      <div v-else class="forum__empty reveal">
        <div class="forum__empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <p>{{ $t('forum.empty') }}</p>
        <NuxtLink to="/forum" class="btn btn--primary">{{ $t('forum.cta') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data, pending } = useFetch<{ data: any[] }>('/api/forum/threads?sort=newest')
const threads = computed(() => data.value?.data?.slice(0, 3) || [])
</script>

<style scoped>
.forum__header { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: var(--space-12); }
.forum__header .section__overtitle::before { display: none; }
.forum__empty { text-align: center; padding: var(--space-12) var(--space-8); background: var(--neutral-0); border-radius: var(--radius-2xl); border: 2px dashed var(--neutral-200); max-width: 600px; margin: 0 auto; }
.forum__empty-icon { color: var(--neutral-300); margin-bottom: var(--space-4); }
.forum__empty p { color: var(--neutral-500); margin-bottom: var(--space-6); max-width: 420px; margin-left: auto; margin-right: auto; }
.forum__loading { text-align: center; color: var(--neutral-500); padding: var(--space-8); }
.thread-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8); text-align: left; }
.thread-card { background: white; padding: var(--space-5); border-radius: var(--radius-lg); border: 1px solid var(--neutral-200); box-shadow: 0 2px 8px rgba(0,0,0,0.03); text-decoration: none; color: inherit; transition: all var(--transition-fast); display: flex; flex-direction: column; gap: var(--space-2); }
.thread-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: var(--green-300); }
.badge { align-self: flex-start; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; background: var(--green-50); color: var(--green-700); }
.thread-title { font-size: var(--text-lg); font-weight: 600; color: var(--neutral-900); }
.thread-meta { font-size: var(--text-sm); color: var(--neutral-500); margin-top: auto; }
.forum__actions { text-align: center; }
</style>
