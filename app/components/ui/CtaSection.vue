<template>
  <section id="donate" class="cta-section">
    <div class="cta-section__bg" aria-hidden="true">
      <div class="cta-section__shape cta-section__shape--1" />
      <div class="cta-section__shape cta-section__shape--2" />
    </div>
    <div class="container">
      <div class="cta-section__content reveal">
        <h2 class="cta-section__title">{{ $t('cta_section.title') }}</h2>
        <p class="cta-section__subtitle">{{ $t('cta_section.subtitle') }}</p>
        <div class="cta-section__buttons">
          <NuxtLink to="/auth/register" class="btn btn--white btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            {{ $t('cta_section.cta_join') }}
          </NuxtLink>
          <a href="#" class="btn btn--gold btn--lg btn--donate">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {{ $t('cta_section.cta_donate') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section { position: relative; padding: var(--space-24) 0; overflow: hidden; background: linear-gradient(135deg, var(--green-700) 0%, var(--green-500) 50%, var(--green-600) 100%); }

.cta-section__bg { position: absolute; inset: 0; pointer-events: none; }
.cta-section__shape { position: absolute; border-radius: 50%; opacity: 0.08; }
.cta-section__shape--1 { width: 500px; height: 500px; background: var(--gold-400); top: -150px; right: -100px; animation: float-slow 20s ease-in-out infinite; }
.cta-section__shape--2 { width: 300px; height: 300px; background: var(--red-400); bottom: -100px; left: -50px; animation: float-slow 15s ease-in-out infinite reverse; }

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

.cta-section__content { text-align: center; position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

.cta-section__title { font-family: var(--font-serif); font-size: var(--text-4xl); font-weight: 700; color: var(--neutral-0); margin-bottom: var(--space-6); }

.cta-section__subtitle { font-size: var(--text-lg); color: rgba(255,255,255,0.85); line-height: 1.7; margin-bottom: var(--space-10); }

.cta-section__buttons { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }

@media (max-width: 480px) {
  .cta-section__title { font-size: var(--text-2xl); }
  .cta-section__buttons { flex-direction: column; }
  .cta-section__buttons .btn { width: 100%; }
}
</style>
