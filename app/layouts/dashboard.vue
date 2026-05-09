<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <NuxtLink to="/">
          <img src="/logo.png" alt="CAP ALI" width="48" height="48" />
        </NuxtLink>
        <div class="brand-text">CAP <strong>ALI</strong></div>
      </div>
      
      <nav class="sidebar-nav">
        <NuxtLink to="/dashboard" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Accueil
        </NuxtLink>
        <NuxtLink to="/dashboard/profile" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mon Profil
        </NuxtLink>
        <!-- Mentors specific links -->
        <template v-if="user?.status === 'mentor'">
          <NuxtLink to="/dashboard/mentorship" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Mes Mentorés
          </NuxtLink>
        </template>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item nav-item--logout" @click="handleLogout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <header class="dashboard-header">
        <h2 class="header-title">{{ route.meta.title || 'Mon espace' }}</h2>
        <div class="header-user">
          <div class="user-info">
            <span class="user-name">{{ user?.name }}</span>
            <span class="user-role">{{ user?.status === 'mentor' ? 'Mentor' : 'Membre' }}</span>
          </div>
          <img v-if="user?.avatarUrl" :src="user?.avatarUrl" :alt="user?.name" class="user-avatar" />
          <div v-else class="user-avatar user-avatar--placeholder">{{ user?.name?.[0] }}</div>
        </div>
      </header>

      <div class="dashboard-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()

async function handleLogout() {
  await logout()
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--neutral-50);
}

.dashboard-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--neutral-100);
}

.sidebar-header img {
  border-radius: var(--radius-full);
}

.brand-text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--neutral-900);
}
.brand-text strong {
  color: var(--green-600);
}

.sidebar-nav {
  padding: var(--space-6) var(--space-4);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  color: var(--neutral-600);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--neutral-100);
  color: var(--neutral-900);
}

.nav-item.router-link-exact-active,
.nav-item.router-link-active:not([href="/dashboard"]) {
  background: var(--green-50);
  color: var(--green-700);
  font-weight: 600;
}
.nav-item.router-link-exact-active[href="/dashboard"] {
  background: var(--green-50);
  color: var(--green-700);
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--neutral-100);
}

.nav-item--logout {
  color: var(--red-500);
}
.nav-item--logout:hover {
  background: var(--red-50);
  color: var(--red-600);
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dashboard-header {
  height: 72px;
  background: white;
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--neutral-900);
}

.header-user {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--neutral-900);
}

.user-role {
  font-size: 11px;
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--neutral-100);
}

.user-avatar--placeholder {
  background: var(--green-100);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--text-lg);
  text-transform: uppercase;
}

.dashboard-content {
  padding: var(--space-8);
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
