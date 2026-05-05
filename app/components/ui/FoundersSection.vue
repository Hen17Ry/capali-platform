<template>
  <section id="founders" class="section founders">
    <div class="container">
      <div class="founders__header reveal">
        <span class="section__overtitle">{{ $t('founders.overtitle') }}</span>
        <h2 class="section__title">{{ $t('founders.title') }}</h2>
      </div>

      <div class="founders__grid">
        <!-- Lucinda -->
        <div class="founders__card reveal--left reveal">
          <div class="founders__photo-wrap">
            <img src="/Lucinda.png" :alt="$t('founders.lucinda_name')" loading="lazy" />
            <div class="founders__accent founders__accent--green" />
          </div>
          <div class="founders__info">
            <h3 class="founders__name">{{ $t('founders.lucinda_name') }}</h3>
            <span class="founders__role founders__role--green">{{ $t('founders.lucinda_role') }}</span>
            <blockquote class="founders__quote">
              <svg class="founders__quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.15"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <p>{{ $t('founders.lucinda_quote') }}</p>
            </blockquote>
          </div>
        </div>

        <!-- Jessica -->
        <div class="founders__card reveal--right reveal">
          <div class="founders__photo-wrap">
            <img src="/Jessica.png" :alt="$t('founders.jessica_name')" loading="lazy" />
            <div class="founders__accent founders__accent--gold" />
          </div>
          <div class="founders__info">
            <h3 class="founders__name">{{ $t('founders.jessica_name') }}</h3>
            <span class="founders__role founders__role--gold">{{ $t('founders.jessica_role') }}</span>
            <blockquote class="founders__quote">
              <svg class="founders__quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.15"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <p>{{ $t('founders.jessica_quote') }}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.founders__header { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: var(--space-16); }
.founders__header .section__overtitle::before { display: none; }

.founders__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); }

.founders__card { background: var(--neutral-0); border-radius: var(--radius-2xl); overflow: hidden; box-shadow: var(--shadow-md); border: 1px solid var(--neutral-100); transition: all var(--transition-base); }
.founders__card:hover { box-shadow: var(--shadow-xl); transform: translateY(-4px); }

.founders__photo-wrap { position: relative; overflow: hidden; }
.founders__photo-wrap img { width: 100%; aspect-ratio: 1; object-fit: cover; object-position: top center; transition: transform var(--transition-slow); }
.founders__card:hover .founders__photo-wrap img { transform: scale(1.03); }

.founders__accent { position: absolute; bottom: 0; left: 0; right: 0; height: 5px; }
.founders__accent--green { background: linear-gradient(90deg, var(--green-500), var(--green-300)); }
.founders__accent--gold { background: linear-gradient(90deg, var(--gold-500), var(--gold-300)); }

.founders__info { padding: var(--space-8); }

.founders__name { font-family: var(--font-serif); font-size: var(--text-xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }

.founders__role { display: inline-block; font-size: var(--text-sm); font-weight: 600; padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); margin-bottom: var(--space-4); }
.founders__role--green { background: var(--green-50); color: var(--green-600); }
.founders__role--gold { background: var(--gold-50); color: var(--gold-700); }

.founders__quote { position: relative; padding-left: var(--space-4); border-left: 3px solid var(--neutral-200); }
.founders__quote-icon { position: absolute; top: -4px; left: var(--space-2); color: var(--green-500); }
.founders__quote p { font-size: var(--text-sm); color: var(--neutral-600); line-height: 1.8; font-style: italic; }

@media (max-width: 768px) {
  .founders__grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
}
</style>
