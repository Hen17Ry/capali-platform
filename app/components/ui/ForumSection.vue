<template>
  <section id="forum" class="section section--light forum">
    <div class="container">
      <div class="forum__header reveal">
        <span class="section__overtitle">{{ $t('forum.overtitle') }}</span>
        <h2 class="section__title">{{ $t('forum.title') }}</h2>
        <p class="section__description">{{ $t('forum.description') }}</p>
      </div>
      <div class="forum__empty reveal">
        <div class="forum__empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <p>{{ $t('forum.empty') }}</p>
        <NuxtLink to="/forum" class="btn btn--primary">{{ $t('forum.cta') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.forum__header { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: var(--space-12); }
.forum__header .section__overtitle::before { display: none; }
.forum__empty { text-align: center; padding: var(--space-12) var(--space-8); background: var(--neutral-0); border-radius: var(--radius-2xl); border: 2px dashed var(--neutral-200); max-width: 600px; margin: 0 auto; }
.forum__empty-icon { color: var(--neutral-300); margin-bottom: var(--space-4); }
.forum__empty p { color: var(--neutral-500); margin-bottom: var(--space-6); max-width: 420px; margin-left: auto; margin-right: auto; }
</style>
