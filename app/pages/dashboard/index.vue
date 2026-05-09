<template>
  <div>
    <div class="welcome-card">
      <h1 class="welcome-title">Bonjour, {{ profile?.name }} 👋</h1>
      <p class="welcome-subtitle">Bienvenue sur votre espace CAP ALI.</p>
    </div>

    <!-- Additional dashboard content can be added here in the future -->
    <div class="dashboard-stats" v-if="profile?.status === 'mentor'">
      <div class="stat-card">
        <div class="stat-value">{{ profile?.mentorProfile?.maxMentees || 0 }}</div>
        <div class="stat-label">Mentorés maximum</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ profile?.mentorProfile?.availableHoursMonth || 0 }}</div>
        <div class="stat-label">Heures par mois</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Accueil' } as any)

const { data: response, error } = await useFetch<{ data: any }>('/api/user/profile')
const profile = computed(() => response.value?.data)

// Mandatory completion check for mentors
if (import.meta.client) {
  if (profile.value?.status === 'mentor') {
    const m = profile.value.mentorProfile
    if (!m?.currentProfession || !m?.presentation || !m?.experiences?.length) {
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
</style>
