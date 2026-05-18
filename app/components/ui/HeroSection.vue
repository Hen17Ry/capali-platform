<template>
  <section id="hero" class="hero">
    <!-- Background image with overlay -->
    <div class="hero__bg">
      <img src="/hero-community.png" alt="" aria-hidden="true" >
      <div class="hero__overlay" />
    </div>

    <!-- Decorative shapes -->
    <div class="hero__shapes" aria-hidden="true">
      <div class="hero__shape hero__shape--1" />
      <div class="hero__shape hero__shape--2" />
      <div class="hero__shape hero__shape--3" />
    </div>

    <div class="hero__content container">
      <div class="hero__text">
        <p class="hero__tagline">{{ $t('hero.tagline') }}</p>

        <h1 class="hero__title">
          {{ $t('hero.title_line1') }}
          <span class="hero__highlight">{{ $t('hero.title_highlight') }}</span>
          <br >{{ $t('hero.title_line2') }}
        </h1>

        <p class="hero__subtitle">{{ $t('hero.subtitle') }}</p>

        <div class="hero__cta">
          <NuxtLink to="/auth/register" class="btn btn--gold btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            {{ $t('hero.cta_join') }}
          </NuxtLink>
          <a href="#mission" class="btn btn--outline-white btn--lg">
            {{ $t('hero.cta_discover') }}
          </a>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="hero__stats">
        <div class="hero__stat">
          <span class="hero__stat-number">500+</span>
          <span class="hero__stat-label">{{ $t('hero.stat_members') }}</span>
        </div>
        <div class="hero__stat-divider" />
        <div class="hero__stat">
          <span class="hero__stat-number">50+</span>
          <span class="hero__stat-label">{{ $t('hero.stat_mentors') }}</span>
        </div>
        <div class="hero__stat-divider" />
        <div class="hero__stat">
          <span class="hero__stat-number">100+</span>
          <span class="hero__stat-label">{{ $t('hero.stat_resources') }}</span>
        </div>
        <div class="hero__stat-divider" />
        <div class="hero__stat">
          <span class="hero__stat-number">12</span>
          <span class="hero__stat-label">{{ $t('hero.stat_countries') }}</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="hero__scroll" aria-hidden="true">
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* Background */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 46, 24, 0.92) 0%,
    rgba(27, 107, 58, 0.85) 40%,
    rgba(19, 79, 43, 0.88) 100%
  );
}

/* Decorative shapes */
.hero__shapes {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.hero__shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
}

.hero__shape--1 {
  width: 600px;
  height: 600px;
  background: var(--gold-400);
  top: -200px;
  right: -150px;
  animation: float-slow 20s ease-in-out infinite;
}

.hero__shape--2 {
  width: 400px;
  height: 400px;
  background: var(--red-400);
  bottom: -100px;
  left: -100px;
  animation: float-slow 25s ease-in-out infinite reverse;
}

.hero__shape--3 {
  width: 200px;
  height: 200px;
  background: var(--gold-300);
  top: 40%;
  right: 20%;
  animation: float-slow 15s ease-in-out infinite 5s;
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(20px, -30px); }
  66% { transform: translate(-15px, 20px); }
}

/* Content */
.hero__content {
  position: relative;
  z-index: 2;
  padding-top: calc(var(--navbar-height) + var(--space-16));
  padding-bottom: var(--space-16);
}

.hero__text {
  max-width: 720px;
}

.hero__tagline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--gold-300);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-6);
  opacity: 0;
  animation: fade-up 0.8s ease-out 0.2s forwards;
}

.hero__tagline::before {
  content: '';
  width: 32px;
  height: 2px;
  background: var(--gold-400);
}

.hero__title {
  font-family: var(--font-serif);
  font-size: var(--text-6xl);
  font-weight: 700;
  color: var(--neutral-0);
  line-height: 1.1;
  margin-bottom: var(--space-6);
  opacity: 0;
  animation: fade-up 0.8s ease-out 0.4s forwards;
}

.hero__highlight {
  color: var(--gold-400);
  font-style: italic;
  position: relative;
}

.hero__highlight::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--red-500);
  border-radius: 2px;
  opacity: 0.7;
}

.hero__subtitle {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  max-width: 580px;
  margin-bottom: var(--space-10);
  opacity: 0;
  animation: fade-up 0.8s ease-out 0.6s forwards;
}

.hero__cta {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  opacity: 0;
  animation: fade-up 0.8s ease-out 0.8s forwards;
}

/* Stats */
.hero__stats {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin-top: var(--space-16);
  padding: var(--space-8);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.12);
  opacity: 0;
  animation: fade-up 0.8s ease-out 1s forwards;
}

.hero__stat {
  text-align: center;
  flex: 1;
}

.hero__stat-number {
  display: block;
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gold-400);
}

.hero__stat-label {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
  margin-top: var(--space-1);
  display: block;
}

.hero__stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

/* Scroll indicator */
.hero__scroll {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.hero__scroll-line {
  width: 2px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.hero__scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 50%;
  background: var(--gold-400);
  animation: scroll-line 2s ease-in-out infinite;
}

@keyframes scroll-line {
  0% { top: -50%; }
  100% { top: 120%; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .hero__title {
    font-size: var(--text-4xl);
  }

  .hero__subtitle {
    font-size: var(--text-base);
  }

  .hero__stats {
    flex-wrap: wrap;
    gap: var(--space-4);
    padding: var(--space-6);
  }

  .hero__stat {
    min-width: 40%;
  }

  .hero__stat-divider {
    display: none;
  }

  .hero__stat-number {
    font-size: var(--text-2xl);
  }

  .hero__content {
    padding-top: calc(var(--navbar-height) + var(--space-10));
  }
}

@media (max-width: 480px) {
  .hero__title {
    font-size: var(--text-3xl);
  }

  .hero__cta {
    flex-direction: column;
  }

  .hero__cta .btn {
    width: 100%;
  }
}
</style>
