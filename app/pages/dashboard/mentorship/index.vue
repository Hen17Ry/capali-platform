<template>
  <div class="mentorship-page">
    <div class="page-header">
      <h1 class="page-title">Mes Mentorés & Demandes</h1>
      <p class="page-subtitle">Gérez vos demandes de mentorat et suivez vos mentorés actuels.</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: currentTab === 'pending' }" 
        @click="currentTab = 'pending'"
      >
        Demandes en attente ({{ pendingRequests.length }})
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: currentTab === 'accepted' }" 
        @click="currentTab = 'accepted'"
      >
        Mes mentorés actifs ({{ acceptedRequests.length }})
      </button>
    </div>

    <div v-if="pending" class="loading-state">Chargement...</div>

    <!-- Requests List -->
    <div v-else class="requests-list">
      <template v-if="currentTab === 'pending'">
        <div v-if="pendingRequests.length === 0" class="empty-state">
          Aucune demande en attente.
        </div>
        <div v-else class="request-card" v-for="req in pendingRequests" :key="req.id">
          <div class="card-header">
            <div class="user-info">
              <img v-if="req.mentee.avatarUrl" :src="req.mentee.avatarUrl" class="avatar" />
              <div v-else class="avatar-placeholder">{{ req.mentee.name[0] }}</div>
              <div>
                <h3 class="mentee-name">{{ req.mentee.name }}</h3>
                <p class="mentee-school" v-if="req.studentProfile?.educationLevel">
                  {{ req.studentProfile.educationLevel }} 
                  <span v-if="req.studentProfile.schoolName">à {{ req.studentProfile.schoolName }}</span>
                </p>
              </div>
            </div>
            <div class="request-date">
              Il y a {{ Math.round((new Date().getTime() - new Date(req.createdAt).getTime()) / (1000 * 3600 * 24)) }} jours
            </div>
          </div>
          
          <div class="card-body">
            <p class="section-label">Projet / Villes ciblées :</p>
            <p class="text-content">
              Arrivée prévue : {{ req.studentProfile?.arrivalDate }} <br />
              <span v-if="req.studentProfile?.targetedCities?.length">
                Villes : {{ req.studentProfile.targetedCities.join(', ') }}
              </span>
            </p>
            
            <p class="section-label mt-3">Besoins :</p>
            <div class="tags">
              <span class="tag" v-for="need in req.studentProfile?.needsHelp" :key="need">{{ need }}</span>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="btn btn--outline btn--sm" @click="viewDetails(req)">Consulter le profil complet</button>
            <div class="actions">
              <button class="btn btn--danger btn--sm" @click="openRefuseModal(req)">Refuser</button>
              <button class="btn btn--primary btn--sm" @click="acceptRequest(req.id)">Accepter</button>
            </div>
          </div>
        </div>
      </template>

      <template v-if="currentTab === 'accepted'">
        <div v-if="acceptedRequests.length === 0" class="empty-state">
          Vous n'avez aucun mentoré actif pour le moment.
        </div>
        <div v-else class="request-card" v-for="req in acceptedRequests" :key="req.id">
          <div class="card-header">
            <div class="user-info">
              <img v-if="req.mentee.avatarUrl" :src="req.mentee.avatarUrl" class="avatar" />
              <div v-else class="avatar-placeholder">{{ req.mentee.name[0] }}</div>
              <div>
                <h3 class="mentee-name">{{ req.mentee.name }}</h3>
                <span class="badge badge--success">Mentoré actif</span>
              </div>
            </div>
          </div>
          <div class="card-footer" style="justify-content: flex-start;">
            <button class="btn btn--outline btn--sm" @click="viewDetails(req)">Consulter le profil</button>
            <!-- Add messaging/contact link here later -->
          </div>
        </div>
      </template>
    </div>

    <!-- Modals -->
    <UiBaseModal v-model="showDetailsModal" :title="'Profil de ' + selectedReq?.mentee.name">
      <div v-if="selectedReq" class="profile-details">
        <h4 class="detail-title">À propos</h4>
        <p class="detail-text">{{ selectedReq.studentProfile?.presentation }}</p>
        
        <h4 class="detail-title mt-4">Projet Académique</h4>
        <ul class="detail-list">
          <li><strong>Niveau :</strong> {{ selectedReq.studentProfile?.educationLevel }}</li>
          <li><strong>École :</strong> {{ selectedReq.studentProfile?.schoolName || 'Non précisé' }}</li>
          <li><strong>Date d'arrivée :</strong> {{ selectedReq.studentProfile?.arrivalDate }}</li>
        </ul>
        
        <h4 class="detail-title mt-4">Besoins spécifiques</h4>
        <div class="tags">
          <span class="tag" v-for="need in selectedReq.studentProfile?.needsHelp" :key="need">{{ need }}</span>
        </div>
      </div>
      <template #footer>
        <button class="btn btn--outline" @click="showDetailsModal = false">Fermer</button>
        <template v-if="selectedReq?.status === 'pending'">
          <button class="btn btn--danger" @click="showDetailsModal = false; openRefuseModal(selectedReq)">Refuser</button>
          <button class="btn btn--primary" @click="showDetailsModal = false; acceptRequest(selectedReq.id)">Accepter</button>
        </template>
      </template>
    </UiBaseModal>

    <UiBaseModal v-model="showRefuseModal" title="Refuser la demande">
      <p>Vous êtes sur le point de refuser la demande de <strong>{{ selectedReq?.mentee.name }}</strong>.</p>
      <p class="text-sm mt-2 text-neutral-500">Vous pouvez ajouter un mot d'explication (optionnel) :</p>
      <textarea v-model="mentorNote" class="form-textarea mt-2" rows="3" placeholder="Ex: Désolé, je n'ai plus de disponibilité actuellement..."></textarea>
      
      <template #footer>
        <button class="btn btn--outline" @click="showRefuseModal = false">Annuler</button>
        <button class="btn btn--danger" @click="refuseRequest" :disabled="isUpdating">Confirmer le refus</button>
      </template>
    </UiBaseModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Mes Mentorés' } as any)

const currentTab = ref('pending')
const { data: response, pending, refresh } = await useFetch<{ data: any[] }>('/api/mentorships/mentor-requests')
const requests = computed(() => response.value?.data || [])

const pendingRequests = computed(() => requests.value.filter(r => r.status === 'pending'))
const acceptedRequests = computed(() => requests.value.filter(r => r.status === 'accepted'))

const selectedReq = ref<any>(null)
const showDetailsModal = ref(false)
const showRefuseModal = ref(false)
const mentorNote = ref('')
const isUpdating = ref(false)

function viewDetails(req: any) {
  selectedReq.value = req
  showDetailsModal.value = true
}

function openRefuseModal(req: any) {
  selectedReq.value = req
  mentorNote.value = ''
  showRefuseModal.value = true
}

async function acceptRequest(id: string) {
  try {
    await $fetch(`/api/mentorships/${id}/status`, {
      method: 'PATCH',
      body: { status: 'accepted' }
    })
    alert('Demande acceptée avec succès !')
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Erreur lors de l\'acceptation.')
  }
}

async function refuseRequest() {
  if (!selectedReq.value) return
  isUpdating.value = true
  try {
    await $fetch(`/api/mentorships/${selectedReq.value.id}/status`, {
      method: 'PATCH',
      body: { status: 'refused', mentorNote: mentorNote.value }
    })
    showRefuseModal.value = false
    alert('Demande refusée.')
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Erreur lors du refus.')
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: var(--space-6);
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
}

.page-subtitle {
  color: var(--neutral-600);
  margin-top: var(--space-2);
}

.tabs {
  display: flex;
  gap: var(--space-4);
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: var(--space-6);
}

.tab-btn {
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--neutral-500);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--neutral-900);
}

.tab-btn.active {
  color: var(--green-600);
  border-bottom-color: var(--green-600);
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.request-card {
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  padding: var(--space-5);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--neutral-100);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.avatar, .avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: var(--green-100);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.mentee-name {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--neutral-900);
}

.mentee-school {
  font-size: var(--text-sm);
  color: var(--neutral-600);
}

.request-date {
  font-size: 12px;
  color: var(--neutral-500);
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 4px;
}

.text-content {
  font-size: 14px;
  color: var(--neutral-700);
  line-height: 1.5;
}

.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: var(--neutral-100);
  color: var(--neutral-700);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px dashed var(--neutral-200);
}

.actions {
  display: flex;
  gap: var(--space-3);
}

.empty-state {
  padding: var(--space-8);
  text-align: center;
  color: var(--neutral-500);
  background: white;
  border-radius: var(--radius-xl);
  border: 1px dashed var(--neutral-200);
}

/* Modal details */
.detail-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-text {
  font-size: var(--text-base);
  color: var(--neutral-700);
  line-height: 1.6;
  white-space: pre-wrap;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-list li {
  margin-bottom: 4px;
  color: var(--neutral-700);
}

.form-textarea {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.btn--danger {
  background: #ef4444;
  color: white;
  border: 1px solid #dc2626;
}
.btn--danger:hover {
  background: #dc2626;
}

.badge--success {
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
}
</style>
