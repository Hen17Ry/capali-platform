<template>
  <section class="section section--cream partners">
    <div class="container">
      <div class="partners__header reveal">
        <span class="section__overtitle">{{ $t('partners.overtitle') }}</span>
        <h2 class="section__title">{{ $t('partners.title') }}</h2>
        <p class="section__description">{{ $t('partners.description') }}</p>
      </div>

      <!-- Auto-scrolling carousel -->
      <div class="partners__carousel reveal" aria-label="Partenaires">
        <div class="partners__track">
          <div v-for="(p, i) in [...placeholders, ...placeholders]" :key="i" class="partners__item">
            <div class="partners__logo-placeholder">
              <span>{{ p }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="partners__cta reveal">
        <a href="mailto:contact@capali.org" class="btn btn--outline btn--lg">{{ $t('partners.become_partner') }}</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const placeholders = ['Partenaire 1', 'Partenaire 2', 'Partenaire 3', 'Partenaire 4', 'Partenaire 5', 'Partenaire 6']
</script>

<style scoped>
.partners__header { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: var(--space-12); }
.partners__header .section__overtitle::before { display: none; }

.partners__carousel { overflow: hidden; margin-bottom: var(--space-10); mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }

.partners__track { display: flex; gap: var(--space-8); animation: scroll-partners 30s linear infinite; width: max-content; }
.partners__track:hover { animation-play-state: paused; }

@keyframes scroll-partners {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.partners__item { flex-shrink: 0; }

.partners__logo-placeholder { width: 180px; height: 80px; background: var(--neutral-0); border: 1px solid var(--neutral-200); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: var(--text-sm); color: var(--neutral-400); font-weight: 500; transition: all var(--transition-base); }
.partners__logo-placeholder:hover { border-color: var(--green-300); box-shadow: var(--shadow-md); }

.partners__cta { text-align: center; }

@media (max-width: 480px) {
  .partners__logo-placeholder { width: 140px; height: 60px; font-size: var(--text-xs); }
}
</style>
