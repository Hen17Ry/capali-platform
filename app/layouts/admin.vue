<template>
  <!-- Auth loading state -->
  <div v-if="isLoading" class="admin-loader">
    <div class="admin-loader__inner">
      <img src="/logo.png" alt="CAP ALI" width="48" height="48" class="admin-loader__logo" >
      <div class="admin-loader__spinner" />
      <span class="admin-loader__text">Chargement...</span>
    </div>
  </div>

  <!-- Admin layout (only when auth is resolved) -->
  <div v-else class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'admin-sidebar--collapsed': sidebarCollapsed, 'admin-sidebar--mobile-open': mobileOpen }">
      <div class="admin-sidebar__header">
        <NuxtLink to="/admin" class="admin-sidebar__logo">
          <img src="/logo.png" alt="CAP ALI" width="40" height="40" >
          <span v-show="!sidebarCollapsed" class="admin-sidebar__logo-text">CAP <strong>ALI</strong></span>
        </NuxtLink>
        <button class="admin-sidebar__toggle" aria-label="Toggle sidebar" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline :points="sidebarCollapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'" /></svg>
        </button>
      </div>

      <nav class="admin-sidebar__nav">
        <span v-show="!sidebarCollapsed" class="admin-sidebar__section-label">Principal</span>

        <NuxtLink v-for="item in mainNav" :key="item.to" :to="item.to" class="admin-sidebar__link" active-class="admin-sidebar__link--active">
          <span class="admin-sidebar__link-icon" v-html="item.icon" />
          <span v-show="!sidebarCollapsed" class="admin-sidebar__link-text">{{ item.label }}</span>
          <span v-if="item.badge && !sidebarCollapsed" class="admin-sidebar__badge">{{ item.badge }}</span>
        </NuxtLink>

        <span v-show="!sidebarCollapsed" class="admin-sidebar__section-label">Contenu</span>

        <NuxtLink v-for="item in contentNav" :key="item.to" :to="item.to" class="admin-sidebar__link" active-class="admin-sidebar__link--active">
          <span class="admin-sidebar__link-icon" v-html="item.icon" />
          <span v-show="!sidebarCollapsed" class="admin-sidebar__link-text">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="admin-sidebar__footer">
        <NuxtLink to="/" class="admin-sidebar__link">
          <span class="admin-sidebar__link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
          <span v-show="!sidebarCollapsed" class="admin-sidebar__link-text">Retour au site</span>
        </NuxtLink>
        <button class="admin-sidebar__link" style="width:100%;text-align:left;" @click="handleLogout">
          <span class="admin-sidebar__link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
          <span v-show="!sidebarCollapsed" class="admin-sidebar__link-text">Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div v-if="mobileOpen" class="admin-overlay" @click="mobileOpen = false" />

    <!-- Main content area -->
    <div class="admin-main" :class="{ 'admin-main--collapsed': sidebarCollapsed }">
      <!-- Top bar -->
      <header class="admin-topbar">
        <button class="admin-topbar__menu" aria-label="Menu" @click="mobileOpen = !mobileOpen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div class="admin-topbar__breadcrumb">
          <span>Administration</span>
        </div>

        <div class="admin-topbar__actions">
          <div class="admin-topbar__user">
            <div class="admin-topbar__avatar">{{ user?.name?.[0]?.toUpperCase() ?? 'A' }}</div>
            <span class="admin-topbar__username">{{ user?.name ?? 'Admin' }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)

const { user, isLoading, logout } = useAuth()

async function handleLogout() {
  if (confirm('Se déconnecter ?')) await logout()
}

const mainNav = [
  { to: '/admin', label: 'Tableau de bord', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { to: '/admin/users', label: 'Utilisateurs', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { to: '/admin/mentors', label: 'Mentors', badge: '', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
  { to: '/admin/moderation', label: 'Modération', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { to: '/admin/messages', label: 'Messagerie', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { to: '/admin/newsletter', label: 'Newsletter', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
]

const contentNav = [
  { to: '/admin/resources', label: 'Ressources', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
  { to: '/admin/events', label: 'Événements', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { to: '/admin/donations', label: 'Dons', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
]

// Close mobile sidebar on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<style scoped>
/* ---- Layout ---- */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
}

/* ---- Sidebar ---- */
.admin-sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--neutral-900);
  color: var(--neutral-300);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-base);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;
}

.admin-sidebar--collapsed {
  width: 72px;
  min-width: 72px;
}

/* Header */
.admin-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 64px;
}

.admin-sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.admin-sidebar__logo img {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
}

.admin-sidebar__logo-text {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--neutral-0);
}

.admin-sidebar__logo-text strong {
  color: var(--gold-400);
}

.admin-sidebar__toggle {
  color: var(--neutral-400);
  padding: var(--space-1);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.admin-sidebar__toggle:hover {
  color: var(--neutral-0);
  background: rgba(255, 255, 255, 0.08);
}

/* Nav */
.admin-sidebar__nav {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-sidebar__section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--neutral-500);
  padding: var(--space-4) var(--space-3) var(--space-2);
}

.admin-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--neutral-400);
  transition: all var(--transition-fast);
  text-decoration: none;
  position: relative;
}

.admin-sidebar__link:hover {
  color: var(--neutral-0);
  background: rgba(255, 255, 255, 0.06);
}

.admin-sidebar__link--active {
  color: var(--neutral-0) !important;
  background: var(--green-600) !important;
}

.admin-sidebar__link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.admin-sidebar__link-text {
  white-space: nowrap;
}

.admin-sidebar__badge {
  margin-left: auto;
  background: var(--red-500);
  color: var(--neutral-0);
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  min-width: 20px;
  text-align: center;
}

/* Footer */
.admin-sidebar__footer {
  padding: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* ---- Main area ---- */
.admin-main {
  flex: 1;
  margin-left: 260px;
  transition: margin-left var(--transition-base);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-main--collapsed {
  margin-left: 72px;
}

/* Top bar */
.admin-topbar {
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  height: 64px;
  background: var(--neutral-0);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  z-index: 50;
}

.admin-topbar__menu {
  display: none;
  color: var(--neutral-600);
  padding: var(--space-2);
  margin-right: var(--space-3);
}

.admin-topbar__breadcrumb {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-500);
}

.admin-topbar__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.admin-topbar__user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.admin-topbar__avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--green-500);
  color: var(--neutral-0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 600;
}

.admin-topbar__username {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-700);
}

/* Content */
.admin-content {
  flex: 1;
  padding: var(--space-8);
}

/* Overlay */
.admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* ---- Mobile ---- */
@media (max-width: 1024px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar--mobile-open {
    transform: translateX(0);
  }

  .admin-main {
    margin-left: 0 !important;
  }

  .admin-topbar__menu {
    display: block;
  }
}

@media (max-width: 640px) {
  .admin-content {
    padding: var(--space-4);
  }

  .admin-topbar {
    padding: 0 var(--space-4);
  }
}

/* ---- Auth Loader ---- */
.admin-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f1f5f9;
}

.admin-loader__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.admin-loader__logo {
  border-radius: var(--radius-full);
  animation: pulse 1.5s ease-in-out infinite;
}

.admin-loader__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--neutral-200);
  border-top-color: var(--green-500);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.admin-loader__text {
  font-size: var(--text-sm);
  color: var(--neutral-400);
  font-weight: 500;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
