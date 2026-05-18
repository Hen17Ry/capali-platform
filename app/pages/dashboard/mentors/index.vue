<template>
  <div class="mentors-page">
    <div class="page-header">
      <h1 class="page-title">Tous nos Mentors</h1>
      <p class="page-subtitle">Découvrez notre communauté de mentors prêts à vous accompagner dans votre projet.</p>
    </div>

    <div v-if="pending" class="loading-state">
      Chargement des mentors...
    </div>
    <div v-else-if="mentors.length === 0" class="empty-state">
      Aucun mentor n'est disponible pour le moment.
    </div>
    <div v-else class="mentors-grid">
      <NuxtLink 
        v-for="mentor in mentors" 
        :key="mentor.id" 
        :to="`/dashboard/mentors/${mentor.id}`"
        class="mentor-card"
      >
        <div class="mentor-card__header">
          <img v-if="mentor.avatarUrl" :src="mentor.avatarUrl" :alt="mentor.name" class="mentor-avatar" >
          <div v-else class="mentor-avatar-placeholder">{{ mentor.name[0] }}</div>
          <div class="mentor-info">
            <h4>{{ mentor.name }}</h4>
            <p class="profession">{{ mentor.currentProfession }}</p>
            <p v-if="mentor.cityCurrentFr" class="location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ mentor.cityCurrentFr }}
            </p>
          </div>
        </div>
        <div v-if="mentor.helpTopics?.length" class="mentor-card__body">
          <div class="topics">
            <span v-for="topic in mentor.helpTopics.slice(0, 3)" :key="topic" class="topic-tag">
              {{ topic }}
            </span>
            <span v-if="mentor.helpTopics.length > 3" class="topic-tag topic-tag--more">
              +{{ mentor.helpTopics.length - 3 }}
            </span>
          </div>
        </div>
        <div class="mentor-card__footer">
          <span class="experience">{{ mentor.yearsExperience }} an(s) d'exp.</span>
          <span class="view-profile">Voir profil &rarr;</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Tous les mentors' } as any)

const { data: response, pending } = await useFetch<{ data: any[] }>('/api/mentors')
const mentors = computed(() => response.value?.data || [])
</script>

<style scoped>
.page-header {
  margin-bottom: var(--space-8);
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-base);
  color: var(--neutral-600);
}

.mentors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

.mentor-card {
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  padding: var(--space-5);
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.mentor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.06);
  border-color: var(--green-300);
}

.mentor-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.mentor-avatar, .mentor-avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.mentor-avatar-placeholder {
  background: var(--green-100);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: 700;
  text-transform: uppercase;
}

.mentor-info {
  flex: 1;
  min-width: 0;
}

.mentor-info h4 {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profession {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location {
  font-size: 12px;
  color: var(--neutral-500);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.mentor-card__body {
  margin-bottom: var(--space-4);
  flex: 1;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.topic-tag {
  background: var(--neutral-100);
  color: var(--neutral-700);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.topic-tag--more {
  background: var(--green-50);
  color: var(--green-700);
}

.mentor-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--neutral-100);
  padding-top: var(--space-4);
  margin-top: auto;
}

.experience {
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-500);
}

.view-profile {
  font-size: 13px;
  font-weight: 600;
  color: var(--green-600);
}

.loading-state, .empty-state {
  padding: var(--space-8);
  text-align: center;
  color: var(--neutral-500);
  background: white;
  border-radius: var(--radius-xl);
  border: 1px dashed var(--neutral-200);
}
</style>
