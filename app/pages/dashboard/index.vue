<template>
  <div>
    <div class="welcome-card">
      <h1 class="welcome-title">Bonjour, {{ profile?.name }} 👋</h1>
      <p class="welcome-subtitle">Bienvenue sur votre espace CAP ALI.</p>
    </div>

    <div class="dashboard-stats" v-if="profile?.status === 'mentor'">
      <div class="stat-card">
        <div class="stat-value">{{ stats.pendingRequests || 0 }}</div>
        <div class="stat-label">Demandes en attente</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--blue-600)">{{ stats.activeMentees || 0 }}</div>
        <div class="stat-label">Mentorés actifs</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--neutral-600)">{{ profile?.mentorProfile?.maxMentees || 0 }}</div>
        <div class="stat-label">Mentorés max autorisés</div>
      </div>
    </div>

    <template v-else-if="profile">
      <div class="dashboard-stats mb-8">
        <div class="stat-card">
          <div class="stat-value">{{ stats.upcomingEvents }}</div>
          <div class="stat-label">Événements à venir</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalResources }}</div>
          <div class="stat-label">Ressources utiles</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.activeForumMembers }}</div>
          <div class="stat-label">Membres actifs forum</div>
        </div>
      </div>

      <div class="quick-links">
        <NuxtLink to="/forum" class="quick-link-card forum-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <h3>Forum communautaire</h3>
          <p>Posez vos questions et échangez.</p>
        </NuxtLink>
        <NuxtLink to="/events" class="quick-link-card events-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h3>Événements</h3>
          <p>Participez à nos webinaires et rencontres.</p>
        </NuxtLink>
        <NuxtLink to="/resources" class="quick-link-card resources-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <h3>Ressources</h3>
          <p>Guides et documents utiles pour votre projet.</p>
        </NuxtLink>
      </div>

      <div class="mt-12">
        <div class="section-header">
          <h2 class="section-title">Mentors recommandés pour vous</h2>
          <NuxtLink to="/dashboard/mentors" class="btn btn--outline btn--sm">Voir tous les mentors</NuxtLink>
        </div>
        <RecommendedMentors />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Accueil' } as any)

const { data: response, error } = await useFetch<{ data: any }>('/api/user/profile')
const profile = computed(() => response.value?.data)

const { data: statsResponse } = await useFetch<any>('/api/user/dashboard-stats')
const stats = computed(() => statsResponse.value || { upcomingEvents: 0, totalResources: 0, activeForumMembers: 0 })

// Mandatory completion check
if (import.meta.client && profile.value) {
  if (profile.value.status === 'mentor') {
    const m = profile.value.mentorProfile
    if (!m?.currentProfession || !m?.presentation || !m?.experiences?.length) {
      navigateTo('/dashboard/profile?require_completion=1')
    }
  } else {
    // For students / mentees
    const s = profile.value.studentProfile
    if (!s?.educationLevel || !s?.arrivalDate || !s?.presentation) {
      navigateTo('/dashboard/profile?require_completion=1')
    }
  }
}
</script>

<style scoped>
.welcome-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  border: 1px solid var(--neutral-200);
  margin-bottom: var(--space-8);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.welcome-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-2);
}

.welcome-subtitle {
  font-size: var(--text-base);
  color: var(--neutral-500);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
}

.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--green-600);
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-600);
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.quick-link-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.06);
}

.quick-link-card svg {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
}

.forum-card svg { background: #e0e7ff; color: #4338ca; }
.events-card svg { background: #ffedd5; color: #c2410c; }
.resources-card svg { background: #dcfce7; color: #15803d; }

.quick-link-card h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-2);
}

.quick-link-card p {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  line-height: 1.5;
}

.mt-12 { margin-top: 3rem; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--neutral-200);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--neutral-900);
}

.mb-8 { margin-bottom: var(--space-8); }
</style>
