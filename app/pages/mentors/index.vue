<template>
  <div class="mentors-page">
    <section class="mentors-hero">
      <div class="mentors-hero__inner">
        <h1 class="mentors-hero__title">Trouvez votre <strong>Mentor</strong> idéal</h1>
        <p class="mentors-hero__desc">Nos mentors expérimentés sont là pour vous guider, vous conseiller et booster votre parcours académique et professionnel.</p>
      </div>
    </section>

    <div class="container mentors-container">
      <!-- Filtres & Recherche -->
      <div class="mentors-toolbar">
        <div class="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Rechercher un mentor, un métier, une ville..." class="search-input" />
        </div>
      </div>

      <div v-if="pending" class="mentors-loading">
        <span class="spinner"></span> Chargement des mentors...
      </div>
      
      <div v-else-if="filteredMentors.length" class="mentors-grid">
        <div v-for="mentor in filteredMentors" :key="mentor.id" class="mentor-card" @click="navigateTo(`/mentors/${mentor.id}`)">
          <div class="mentor-card__header">
            <div class="mentor-avatar">
              <img v-if="mentor.avatarUrl" :src="mentor.avatarUrl" :alt="mentor.name">
              <span v-else>{{ mentor.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="mentor-info">
              <h3 class="mentor-name">{{ mentor.name }}</h3>
              <p class="mentor-profession">{{ mentor.currentProfession || 'Professionnel' }}</p>
            </div>
          </div>
          
          <div class="mentor-card__body">
            <div class="mentor-detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ mentor.cityCurrentFr || 'Non précisé' }}</span>
            </div>
            <div v-if="mentor.yearsExperience" class="mentor-detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ mentor.yearsExperience }} ans d'expérience</span>
            </div>
            
            <div v-if="mentor.helpTopics && mentor.helpTopics.length" class="mentor-topics">
              <span v-for="(topic, idx) in mentor.helpTopics.slice(0, 3)" :key="idx" class="topic-tag">
                {{ topic }}
              </span>
              <span v-if="mentor.helpTopics.length > 3" class="topic-tag topic-tag--more">
                +{{ mentor.helpTopics.length - 3 }}
              </span>
            </div>
          </div>
          
          <div class="mentor-card__footer">
            <span class="btn-view">
              Voir le profil
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="mentors-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h3>Aucun mentor trouvé</h3>
        <p>Essayez de modifier votre recherche avec d'autres mots-clés.</p>
        <button class="btn btn--outline mt-4" @click="searchQuery = ''">Réinitialiser la recherche</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Trouver un Mentor',
  meta: [{ name: 'description', content: 'Découvrez la liste de nos mentors expérimentés prêts à vous accompagner.' }]
})

const { data: response, pending } = await useFetch<{ data: any[] }>('/api/mentors')
const mentorsList = computed(() => response.value?.data || [])

const searchQuery = ref('')

const filteredMentors = computed(() => {
  if (!searchQuery.value) return mentorsList.value
  
  const query = searchQuery.value.toLowerCase()
  return mentorsList.value.filter(m => 
    m.name?.toLowerCase().includes(query) ||
    m.currentProfession?.toLowerCase().includes(query) ||
    m.cityCurrentFr?.toLowerCase().includes(query) ||
    (m.helpTopics && m.helpTopics.some((t: string) => t.toLowerCase().includes(query)))
  )
})
</script>

<style scoped>
.mentors-hero {
  background: linear-gradient(135deg, #133a28 0%, #1a523a 100%);
  padding: 80px 24px 64px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.mentors-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(circle at 20% 150%, rgba(212, 168, 67, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% -20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
  pointer-events: none;
}
.mentors-hero__inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
.mentors-hero__title { font-family: var(--font-serif); font-size: clamp(36px, 5vw, 48px); font-weight: 800; color: white; margin-bottom: var(--space-4); letter-spacing: -0.02em; }
.mentors-hero__title strong { color: #d4a843; font-weight: 800; }
.mentors-hero__desc { color: rgba(255,255,255,0.85); font-size: var(--text-lg); line-height: 1.6; font-weight: 400; }

.mentors-container { padding-top: 48px; padding-bottom: 96px; }

.mentors-toolbar { margin-bottom: 40px; display: flex; justify-content: center; }
.search-box { 
  display: flex; 
  align-items: center; 
  background: white; 
  border-radius: 100px; 
  padding: 8px 24px; 
  width: 100%; 
  max-width: 600px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.06); 
  border: 1px solid var(--neutral-100);
  transition: all 0.3s;
}
.search-box:focus-within {
  box-shadow: 0 8px 32px rgba(27, 107, 58, 0.12);
  border-color: var(--green-300);
}
.search-box svg { color: var(--neutral-400); margin-right: 12px; }
.search-input { border: none; background: transparent; width: 100%; padding: 12px 0; font-size: 16px; color: var(--neutral-800); outline: none; }
.search-input::placeholder { color: var(--neutral-400); }

.mentors-loading { text-align: center; color: var(--neutral-500); padding: 60px; font-size: 18px; display: flex; align-items: center; justify-content: center; gap: 12px; }
.spinner { width: 24px; height: 24px; border: 3px solid var(--neutral-200); border-top-color: var(--green-600); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.mentors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }

.mentor-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}
.mentor-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border-color: var(--green-200);
}

.mentor-card__header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.mentor-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--green-50);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  flex-shrink: 0;
}
.mentor-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mentor-info { flex: 1; overflow: hidden; }
.mentor-name { font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--neutral-900); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mentor-profession { font-size: 14px; color: var(--green-700); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.mentor-card__body { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.mentor-detail { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--neutral-600); }
.mentor-detail svg { color: var(--neutral-400); flex-shrink: 0; }

.mentor-topics { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--neutral-100); }
.topic-tag { background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
.topic-tag--more { background: var(--green-50); color: var(--green-700); }

.mentor-card__footer { margin-top: 24px; display: flex; justify-content: flex-end; }
.btn-view { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--green-600); transition: color 0.2s; }
.mentor-card:hover .btn-view { color: var(--green-800); }

.mentors-empty { text-align: center; padding: 80px 24px; background: var(--neutral-0); border-radius: 24px; border: 2px dashed var(--neutral-200); color: var(--neutral-500); }
.mentors-empty svg { margin: 0 auto 16px; color: var(--neutral-300); }
.mentors-empty h3 { font-family: var(--font-serif); font-size: 24px; color: var(--neutral-900); margin-bottom: 8px; }
.mt-4 { margin-top: 1rem; }
</style>
