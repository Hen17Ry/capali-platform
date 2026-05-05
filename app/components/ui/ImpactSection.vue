<template>
  <section class="section section--green impact">
    <div class="container">
      <div class="impact__header reveal">
        <span class="impact__overtitle">{{ $t('impact.overtitle') }}</span>
        <h2 class="impact__title">{{ $t('impact.title') }}</h2>
      </div>
      <div class="impact__grid reveal-stagger">
        <div v-for="(stat, i) in stats" :key="i" class="impact__stat">
          <span class="impact__number">{{ stat.number }}</span>
          <span class="impact__label">{{ $t(stat.label) }}</span>
        </div>
      </div>
      <div class="impact__cta reveal">
        <a href="#donate" class="btn btn--gold btn--lg btn--donate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {{ $t('nav.donate') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { number: '500+', label: 'impact.stat1_label' },
  { number: '50+', label: 'impact.stat2_label' },
  { number: '15+', label: 'impact.stat3_label' },
  { number: '8', label: 'impact.stat4_label' },
]
</script>

<style scoped>
.impact__header { text-align: center; margin-bottom: var(--space-12); }
.impact__overtitle { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-300); margin-bottom: var(--space-4); }
.impact__overtitle::before { content: ''; width: 24px; height: 2px; background: var(--gold-400); }
.impact__title { font-family: var(--font-serif); font-size: var(--text-4xl); font-weight: 700; color: var(--neutral-0); }

.impact__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-8); margin-bottom: var(--space-12); }

.impact__stat { text-align: center; padding: var(--space-8); background: rgba(255,255,255,0.08); border-radius: var(--radius-xl); border: 1px solid rgba(255,255,255,0.1); transition: all var(--transition-base); }
.impact__stat:hover { background: rgba(255,255,255,0.14); transform: translateY(-4px); }

.impact__number { display: block; font-family: var(--font-serif); font-size: var(--text-5xl); font-weight: 700; color: var(--gold-400); margin-bottom: var(--space-2); }
.impact__label { font-size: var(--text-sm); color: rgba(255,255,255,0.8); line-height: 1.5; }

.impact__cta { text-align: center; }

@media (max-width: 768px) {
  .impact__grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
  .impact__number { font-size: var(--text-3xl); }
  .impact__title { font-size: var(--text-3xl); }
}
</style>
