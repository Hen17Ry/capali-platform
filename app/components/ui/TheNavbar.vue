<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled, 'navbar--open': isMobileOpen }">
    <div class="navbar__inner container container--wide">
      <!-- Logo -->
      <NuxtLink to="/" class="navbar__logo" aria-label="CAP ALI — Accueil">
        <img src="/logo.png" alt="CAP ALI" width="48" height="48" >
        <span class="navbar__logo-text">CAP <span class="navbar__logo-highlight">ALI</span></span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="navbar__nav" :class="{ 'navbar__nav--open': isMobileOpen }">
        <ul class="navbar__links">
          <li><NuxtLink to="/orientation" class="navbar__link" @click="closeMobile">Orientation</NuxtLink></li>
          <li><a href="#mission" class="navbar__link" @click="closeMobile">{{ $t('nav.about') }}</a></li>
          <li><a href="#mentorship" class="navbar__link" @click="closeMobile">{{ $t('nav.mentorship') }}</a></li>
          <li><a href="#resources" class="navbar__link" @click="closeMobile">{{ $t('nav.resources') }}</a></li>
          <li><a href="#events" class="navbar__link" @click="closeMobile">{{ $t('nav.events') }}</a></li>
          <li><a href="#forum" class="navbar__link" @click="closeMobile">{{ $t('nav.forum') }}</a></li>
        </ul>

        <div class="navbar__actions">
          <!-- Language Switcher -->
          <div class="navbar__lang">
            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              class="navbar__lang-btn"
              :class="{ 'navbar__lang-btn--active': locale === loc.code }"
              :aria-label="`Switch to ${loc.name}`"
              @click="switchLang(loc.code)"
            >
              {{ loc.code.toUpperCase() }}
            </button>
          </div>

          <!-- Donate Button -->
          <a href="#" class="btn btn--gold btn--sm btn--donate" @click.prevent="openDonationModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {{ $t('nav.donate') }}
          </a>

          <!-- Auth Buttons -->
          <NuxtLink to="/auth/login" class="navbar__link navbar__link--auth" @click="closeMobile">{{ $t('nav.login') }}</NuxtLink>
          <NuxtLink to="/auth/register" class="btn btn--primary btn--sm" @click="closeMobile">{{ $t('nav.register') }}</NuxtLink>
        </div>
      </nav>

      <!-- Mobile Hamburger -->
      <button
        class="navbar__hamburger"
        :class="{ 'navbar__hamburger--open': isMobileOpen }"
        aria-label="Menu"
        @click="toggleMobile"
      >
        <span/>
        <span/>
        <span/>
      </button>
    </div>

    <!-- Mobile overlay -->
    <div v-if="isMobileOpen" class="navbar__overlay" @click="closeMobile" />
  </header>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const isScrolled = ref(false)
const isMobileOpen = ref(false)

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>)
)

function switchLang(code: string) {
  setLocale(code as 'fr' | 'en')
  closeMobile()
}

function toggleMobile() {
  isMobileOpen.value = !isMobileOpen.value
  document.body.style.overflow = isMobileOpen.value ? 'hidden' : ''
}

function closeMobile() {
  isMobileOpen.value = false
  document.body.style.overflow = ''
}

function openDonationModal() {
  closeMobile()
  useDonationModal().open()
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--navbar-height);
  transition: all var(--transition-base);
  background: transparent;
}

.navbar--scrolled,
.navbar--open {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: var(--space-8);
}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  z-index: 1001;
  flex-shrink: 0;
}

.navbar__logo img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  transition: transform var(--transition-spring);
}

.navbar__logo:hover img {
  transform: scale(1.08) rotate(-5deg);
}

.navbar__logo-text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--neutral-0);
  transition: color var(--transition-base);
}

.navbar--scrolled .navbar__logo-text,
.navbar--open .navbar__logo-text {
  color: var(--neutral-900);
}

.navbar__logo-highlight {
  color: var(--color-accent);
}

/* Navigation */
.navbar__nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex: 1;
  justify-content: flex-end;
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.navbar__link {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.navbar--scrolled .navbar__link {
  color: var(--neutral-600);
}

.navbar__link:hover {
  color: var(--neutral-0);
  background: rgba(255, 255, 255, 0.1);
}

.navbar--scrolled .navbar__link:hover {
  color: var(--color-primary);
  background: var(--green-50);
}

.navbar__link--auth {
  font-weight: 600;
}

/* Language Switcher */
.navbar__lang {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  padding: 2px;
}

.navbar--scrolled .navbar__lang {
  background: var(--neutral-100);
}

.navbar__lang-btn {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.navbar--scrolled .navbar__lang-btn {
  color: var(--neutral-500);
}

.navbar__lang-btn--active {
  background: var(--neutral-0);
  color: var(--color-primary) !important;
  box-shadow: var(--shadow-sm);
}

.navbar--scrolled .navbar__lang-btn--active {
  background: var(--color-primary);
  color: var(--neutral-0) !important;
}

/* Actions */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* Hamburger */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  z-index: 1001;
  padding: var(--space-2);
}

.navbar__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--neutral-0);
  transition: all var(--transition-base);
  border-radius: 2px;
}

.navbar--scrolled .navbar__hamburger span {
  background: var(--neutral-800);
}

.navbar__hamburger--open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background: var(--neutral-800) !important;
}

.navbar__hamburger--open span:nth-child(2) {
  opacity: 0;
}

.navbar__hamburger--open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  background: var(--neutral-800) !important;
}

.navbar__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

/* --- Mobile --- */
@media (max-width: 1024px) {
  .navbar__hamburger {
    display: flex;
  }

  .navbar__nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 85%;
    max-width: 380px;
    height: 100vh;
    background: var(--neutral-0);
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: calc(var(--navbar-height) + var(--space-8)) var(--space-8) var(--space-8);
    gap: var(--space-6);
    transition: right var(--transition-base);
    z-index: 1000;
    box-shadow: var(--shadow-2xl);
    overflow-y: auto;
  }

  .navbar__nav--open {
    right: 0;
  }

  .navbar__links {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 0;
  }

  .navbar__link {
    color: var(--neutral-700) !important;
    font-size: var(--text-base);
    padding: var(--space-3) var(--space-4);
    width: 100%;
    border-radius: var(--radius-lg);
  }

  .navbar__link:hover {
    background: var(--green-50) !important;
    color: var(--color-primary) !important;
  }

  .navbar__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--neutral-200);
  }

  .navbar__actions .btn {
    justify-content: center;
  }

  .navbar__lang {
    align-self: flex-start;
    background: var(--neutral-100);
  }

  .navbar__lang-btn {
    color: var(--neutral-500);
  }
}
</style>
