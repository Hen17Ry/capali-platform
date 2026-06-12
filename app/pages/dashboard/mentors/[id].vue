<template>
  <div class="mentor-profile-page">
    <div class="back-link">
      <NuxtLink to="/dashboard" class="btn btn--outline btn--sm">
        &larr; Retour au tableau de bord
      </NuxtLink>
    </div>

    <div v-if="pending" class="loading">
      Chargement du profil...
    </div>
    
    <div v-else-if="!mentor" class="error">
      Ce mentor n'existe pas ou n'est plus disponible.
    </div>

    <div v-else class="profile-container">
      <!-- Header Section -->
      <div class="profile-header">
        <div class="profile-cover"/>
        <div class="profile-header-content">
          <div class="header-top-row">
            <div class="avatar-wrapper">
              <img v-if="mentor.avatarUrl" :src="mentor.avatarUrl" :alt="mentor.name" class="avatar" >
              <div v-else class="avatar-placeholder">{{ mentor.name[0] }}</div>
            </div>
            <div class="header-actions">
              <button class="btn btn--primary" :disabled="isRequesting" @click="initRequest">
                {{ isRequesting ? 'Demande en cours...' : 'Demander un mentorat' }}
              </button>
              <a v-if="mentor.linkedinUrl" :href="mentor.linkedinUrl" target="_blank" class="btn btn--outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
          
          <div class="header-info">
            <h1 class="mentor-name">{{ mentor.name }}</h1>
            <p class="profession">{{ mentor.currentProfession }}</p>
            
            <div class="mentor-badges mt-3">
              <span class="badge badge--experience">{{ mentor.yearsExperience }} an(s) d'exp.</span>
              <span v-if="mentor.cityCurrentFr" class="badge badge--location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ mentor.cityCurrentFr }}
              </span>
              <span v-if="mentor.availableHoursMonth" class="badge badge--hours">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ mentor.availableHoursMonth }}h / mois
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="profile-body">
        <div class="main-column">
          <section class="content-section">
            <h3 class="section-title">À propos</h3>
            <div class="presentation-text">
              {{ mentor.presentation }}
            </div>
          </section>

          <section v-if="mentor.experiences?.length" class="content-section">
            <h3 class="section-title">Parcours professionnel</h3>
            <div class="timeline">
              <div v-for="(exp, idx) in mentor.experiences" :key="idx" class="timeline-item">
                <div class="timeline-marker"/>
                <div class="timeline-content">
                  <h4 class="exp-title">{{ exp.title }}</h4>
                  <p class="exp-company">{{ exp.company }}</p>
                  <p class="exp-dates">
                    {{ formatMonthYear(exp.startDate) }} - {{ exp.current ? "Aujourd'hui" : formatMonthYear(exp.endDate) }}
                  </p>
                  <p v-if="exp.description" class="exp-desc">{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="side-column">
          <section v-if="mentor.helpTopics?.length" class="content-section">
            <h3 class="section-title">Domaines d'expertise</h3>
            <div class="topics-list">
              <span v-for="topic in mentor.helpTopics" :key="topic" class="topic-tag">
                {{ topic }}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UiBaseModal v-model="showConfirmModal" title="Confirmer la demande">
      <p>Êtes-vous sûr(e) de vouloir envoyer une demande de mentorat à <strong>{{ mentor?.name }}</strong> ?</p>
      <p class="text-sm mt-2 text-neutral-500">Assurez-vous que son profil correspond bien à vos besoins.</p>
      <template #footer>
        <button class="btn btn--outline" @click="showConfirmModal = false">Annuler</button>
        <button class="btn btn--primary" @click="confirmRequest">Oui, envoyer</button>
      </template>
    </UiBaseModal>

    <UiBaseModal v-model="showSuccessModal" title="Demande envoyée !">
      <p>Votre demande de mentorat a bien été envoyée à <strong>{{ mentor?.name }}</strong>.</p>
      <p class="text-sm mt-2 text-neutral-500">Le mentor va étudier votre profil et vous répondra sous peu.</p>
      <template #footer>
        <button class="btn btn--primary" @click="showSuccessModal = false">Compris</button>
      </template>
    </UiBaseModal>

    <UiBaseModal v-model="showErrorModal" title="Oups, une erreur est survenue">
      <p>{{ errorMessage }}</p>
      <template #footer>
        <button class="btn btn--outline" @click="showErrorModal = false">Fermer</button>
      </template>
    </UiBaseModal>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Profil Mentor' } as any)
const route = useRoute()

const { data: response, pending } = await useFetch<{ data: any }>(`/api/mentors/${route.params.id}`)
const mentor = computed(() => response.value?.data)

const isRequesting = ref(false)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

function formatMonthYear(val: string) {
  if (!val) return ''
  const parts = val.split('-')
  if (parts.length < 2) return val
  
  const year = parseInt(parts[0]!)
  const month = parseInt(parts[1]!)
  
  if (isNaN(year) || isNaN(month)) return val
  
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function initRequest() {
  showConfirmModal.value = true
}

async function confirmRequest() {
  showConfirmModal.value = false
  isRequesting.value = true
  try {
    await $fetch('/api/mentorships/request', {
      method: 'POST',
      body: { mentorId: mentor.value?.id }
    })
    showSuccessModal.value = true
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Une erreur est survenue lors de la demande.'
    showErrorModal.value = true
  } finally {
    isRequesting.value = false
  }
}
</script>

<style scoped>
.mentor-profile-page {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  margin-bottom: var(--space-6);
}

.profile-container {
  background: white;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid var(--neutral-200);
}

.profile-cover {
  height: 160px;
  background: linear-gradient(135deg, var(--green-600) 0%, var(--green-800) 100%);
  position: relative;
}

.profile-header-content {
  padding: 0 var(--space-8) var(--space-6);
  position: relative;
  z-index: 2;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: -70px;
  margin-bottom: var(--space-4);
}

.avatar-wrapper {
  border: 4px solid white;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
  display: inline-block;
}

.avatar, .avatar-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: var(--green-100);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.header-actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.header-info {
  padding-bottom: var(--space-2);
}

.mentor-name {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 700;
  color: var(--neutral-900);
  line-height: 1.2;
  margin-bottom: 4px;
}

.profession {
  font-size: var(--text-lg);
  color: var(--neutral-600);
  font-weight: 500;
}

.mentor-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.mt-3 {
  margin-top: var(--space-3);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
}
.badge--experience { background: var(--green-50); color: var(--green-700); }
.badge--location { background: var(--neutral-100); color: var(--neutral-700); }
.badge--hours { background: #eff6ff; color: #1d4ed8; }

.profile-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
  padding: var(--space-8);
  border-top: 1px solid var(--neutral-100);
  background: var(--neutral-0);
}

.content-section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--neutral-100);
}

.presentation-text {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--neutral-700);
  white-space: pre-wrap;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  width: 2px;
  background: var(--neutral-200);
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-6);
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -20px;
  top: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--green-500);
}

.timeline-content {
  background: var(--neutral-50);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
}

.exp-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--neutral-900);
}

.exp-company {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--neutral-700);
  margin-top: 2px;
}

.exp-dates {
  font-size: 13px;
  color: var(--neutral-500);
  margin-top: 4px;
  margin-bottom: var(--space-2);
  text-transform: capitalize;
}

.exp-desc {
  font-size: 14px;
  color: var(--neutral-600);
  line-height: 1.5;
  white-space: pre-wrap;
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  background: var(--green-50);
  color: var(--green-700);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .profile-header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -70px;
  }
  
  .header-main {
    justify-content: center;
  }

  .header-actions {
    justify-content: center;
  }

  .profile-body {
    grid-template-columns: 1fr;
  }
}
</style>
