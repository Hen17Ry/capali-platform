<template>
  <section id="resources" class="section section--cream resources">
    <div class="container">
      <div class="resources__header reveal">
        <span class="section__overtitle">{{ $t('resources.overtitle') }}</span>
        <h2 class="section__title">{{ $t('resources.title') }}</h2>
        <p class="section__description">{{ $t('resources.description') }}</p>
      </div>

      <!-- Themes grid -->
      <div class="resources__themes reveal-stagger">
        <div v-for="(theme, i) in themes" :key="i" class="resources__theme-card">
          <div class="resources__theme-icon" v-html="theme.icon" />
          <span class="resources__theme-name">{{ $t(theme.label) }}</span>
        </div>
      </div>

      <!-- Empty state -->
      <div class="resources__empty reveal">
        <div class="resources__empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <p>{{ $t('resources.empty') }}</p>
        <NuxtLink to="/resources" class="btn btn--primary">{{ $t('resources.cta') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const themes = [
  { label: 'resources.theme_housing', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { label: 'resources.theme_bank', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { label: 'resources.theme_studies', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>' },
  { label: 'resources.theme_employment', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
  { label: 'resources.theme_daily', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { label: 'resources.theme_health', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
  { label: 'resources.theme_orientation', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>' },
  { label: 'resources.theme_rights', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
]
</script>

<style scoped>
.resources__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-12);
}

.resources__header .section__overtitle::before {
  display: none;
}

.resources__themes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.resources__theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  transition: all var(--transition-base);
  cursor: default;
}

.resources__theme-card:hover {
  border-color: var(--green-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.resources__theme-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--green-50);
  color: var(--green-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.resources__theme-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-700);
  text-align: center;
}

/* Empty state */
.resources__empty {
  text-align: center;
  padding: var(--space-12) var(--space-8);
  background: var(--neutral-0);
  border-radius: var(--radius-2xl);
  border: 2px dashed var(--neutral-200);
}

.resources__empty-icon {
  color: var(--neutral-300);
  margin-bottom: var(--space-4);
}

.resources__empty p {
  color: var(--neutral-500);
  font-size: var(--text-base);
  margin-bottom: var(--space-6);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .resources__themes {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .resources__themes {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .resources__theme-card {
    padding: var(--space-4);
  }
}
</style>
