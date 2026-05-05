<template>
  <section id="events" class="section events">
    <div class="container">
      <div class="events__layout">
        <div class="events__content reveal--left reveal">
          <span class="section__overtitle">{{ $t('events.overtitle') }}</span>
          <h2 class="section__title">{{ $t('events.title') }}</h2>
          <p class="section__description">{{ $t('events.description') }}</p>
          <div class="events__empty">
            <div class="events__empty-calendar">
              <div class="events__cal-header"><span>{{ currentMonth }}</span></div>
              <div class="events__cal-dots"><span /><span /><span /></div>
              <p class="events__cal-text">{{ $t('events.empty') }}</p>
            </div>
          </div>
          <NuxtLink to="/events" class="btn btn--outline btn--lg">{{ $t('events.cta') }}</NuxtLink>
        </div>
        <div class="events__visual reveal--right reveal">
          <img src="/community-event.png" alt="Événement CAP ALI" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const currentMonth = computed(() =>
  new Date().toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
)
</script>

<style scoped>
.events__layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center; }
.events__empty { margin: var(--space-8) 0; }
.events__empty-calendar { background: var(--neutral-50); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--neutral-200); max-width: 380px; }
.events__cal-header { background: var(--green-500); color: var(--neutral-0); padding: var(--space-3) var(--space-4); font-weight: 600; font-size: var(--text-sm); text-transform: capitalize; }
.events__cal-dots { display: flex; gap: var(--space-3); padding: var(--space-4); }
.events__cal-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--neutral-200); }
.events__cal-text { padding: var(--space-4) var(--space-4) var(--space-6); font-size: var(--text-sm); color: var(--neutral-400); font-style: italic; }
.events__visual { border-radius: var(--radius-2xl); overflow: hidden; box-shadow: var(--shadow-xl); }
.events__visual img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
@media (max-width: 768px) {
  .events__layout { grid-template-columns: 1fr; gap: var(--space-8); }
  .events__visual { order: -1; }
}
</style>
