<template>
  <section id="mentorship" class="section mentorship">
    <div class="container">
      <div class="mentorship__layout">
        <!-- Left: content -->
        <div class="mentorship__content reveal--left reveal">
          <span class="section__overtitle">{{ $t('mentorship.overtitle') }}</span>
          <h2 class="section__title">{{ $t('mentorship.title') }}</h2>
          <p class="section__description">{{ $t('mentorship.description') }}</p>

          <!-- Steps -->
          <div class="mentorship__steps">
            <div class="mentorship__step">
              <div class="mentorship__step-num">1</div>
              <div>
                <h4 class="mentorship__step-title">{{ $t('mentorship.step1_title') }}</h4>
                <p class="mentorship__step-desc">{{ $t('mentorship.step1_desc') }}</p>
              </div>
            </div>
            <div class="mentorship__step">
              <div class="mentorship__step-num">2</div>
              <div>
                <h4 class="mentorship__step-title">{{ $t('mentorship.step2_title') }}</h4>
                <p class="mentorship__step-desc">{{ $t('mentorship.step2_desc') }}</p>
              </div>
            </div>
            <div class="mentorship__step">
              <div class="mentorship__step-num">3</div>
              <div>
                <h4 class="mentorship__step-title">{{ $t('mentorship.step3_title') }}</h4>
                <p class="mentorship__step-desc">{{ $t('mentorship.step3_desc') }}</p>
              </div>
            </div>
          </div>

          <div class="mentorship__cta">
            <NuxtLink to="/mentors" class="btn btn--primary btn--lg">{{ $t('mentorship.cta') }}</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn--outline btn--lg">{{ $t('mentorship.become_mentor') }}</NuxtLink>
          </div>
        </div>

        <!-- Right: image card -->
        <div class="mentorship__visual reveal--right reveal">
          <div class="mentorship__image-wrapper">
            <img src="/mentorship-scene.png" alt="Séance de mentorat" loading="lazy" />
            <div class="mentorship__badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Mentors vérifiés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mentorship__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.mentorship__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin: var(--space-10) 0;
}

.mentorship__step {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.mentorship__step-num {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--green-500), var(--green-400));
  color: var(--neutral-0);
  font-weight: 700;
  font-size: var(--text-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(27, 107, 58, 0.25);
}

.mentorship__step-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--neutral-900);
  margin-bottom: var(--space-1);
}

.mentorship__step-desc {
  font-size: var(--text-sm);
  color: var(--neutral-500);
  line-height: 1.6;
}

.mentorship__cta {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

/* Visual */
.mentorship__image-wrapper {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.mentorship__image-wrapper img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
}

.mentorship__badge {
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-6);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--green-600);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .mentorship__layout {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .mentorship__visual {
    order: -1;
  }

  .mentorship__image-wrapper img {
    aspect-ratio: 16/10;
  }

  .mentorship__cta {
    flex-direction: column;
  }

  .mentorship__cta .btn {
    width: 100%;
  }
}
</style>
