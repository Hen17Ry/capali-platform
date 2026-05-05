<template>
  <section id="mission" class="section section--light mission">
    <div class="container">
      <div class="mission__header reveal">
        <span class="section__overtitle">{{ $t('mission.overtitle') }}</span>
        <h2 class="section__title">{{ $t('mission.title') }}</h2>
        <p class="section__description">{{ $t('mission.description') }}</p>
      </div>

      <div class="mission__grid reveal-stagger">
        <!-- Pillar 1: Orienter -->
        <div class="mission__card">
          <div class="mission__icon mission__icon--green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <h3 class="mission__card-title">{{ $t('mission.pillar1_title') }}</h3>
          <p class="mission__card-desc">{{ $t('mission.pillar1_desc') }}</p>
        </div>

        <!-- Pillar 2: Accompagner -->
        <div class="mission__card">
          <div class="mission__icon mission__icon--gold">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 class="mission__card-title">{{ $t('mission.pillar2_title') }}</h3>
          <p class="mission__card-desc">{{ $t('mission.pillar2_desc') }}</p>
        </div>

        <!-- Pillar 3: Fédérer -->
        <div class="mission__card">
          <div class="mission__icon mission__icon--red">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h3 class="mission__card-title">{{ $t('mission.pillar3_title') }}</h3>
          <p class="mission__card-desc">{{ $t('mission.pillar3_desc') }}</p>
        </div>
      </div>

      <!-- Image -->
      <div class="mission__visual reveal">
        <img src="/mentorship-scene.png" alt="Mentorat CAP ALI" loading="lazy" />
        <div class="mission__visual-accent" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.mission__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-16);
}

.mission__header .section__overtitle::before {
  display: none;
}

.mission__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-16);
}

.mission__card {
  background: var(--neutral-0);
  border-radius: var(--radius-2xl);
  padding: var(--space-10);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.mission__card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: transparent;
  transition: background var(--transition-base);
}

.mission__card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}

.mission__card:nth-child(1):hover::after { background: var(--green-500); }
.mission__card:nth-child(2):hover::after { background: var(--gold-500); }
.mission__card:nth-child(3):hover::after { background: var(--red-500); }

.mission__icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
}

.mission__icon--green {
  background: var(--green-50);
  color: var(--green-500);
}

.mission__icon--gold {
  background: var(--gold-50);
  color: var(--gold-600);
}

.mission__icon--red {
  background: var(--red-50);
  color: var(--red-500);
}

.mission__card-title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-3);
}

.mission__card-desc {
  font-size: var(--text-sm);
  color: var(--neutral-500);
  line-height: 1.7;
}

/* Visual */
.mission__visual {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  max-height: 420px;
}

.mission__visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mission__visual-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--green-500) 33%, var(--gold-400) 33% 66%, var(--red-500) 66%);
}

@media (max-width: 768px) {
  .mission__grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .mission__card {
    padding: var(--space-6);
  }
}
</style>
