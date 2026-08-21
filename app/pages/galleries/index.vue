<template>
  <div class="page-wrapper">
    <!-- Premium Hero Section -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="container relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <span class="section__overtitle">Souvenirs</span>
          <h1 class="hero-title">Galeries <span class="text-primary-600">Photos</span></h1>
          <p class="hero-subtitle">
            Revivez les moments forts de nos conférences, ateliers et rencontres communautaires.
          </p>
        </div>
      </div>
    </section>

    <section class="section py-16 bg-neutral-0">
      <div class="container">
        <div v-if="pending" class="text-center py-20 text-neutral-500">
          <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Chargement des galeries...
        </div>
        <div v-else-if="error" class="text-center py-20 text-red-500">
          Une erreur est survenue lors du chargement.
        </div>
        <div v-else-if="!galleries || galleries.length === 0" class="empty-state text-center py-20">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto text-neutral-300 mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <h3 class="text-xl font-bold font-serif text-neutral-900 mb-2">Aucune galerie</h3>
          <p class="text-neutral-500">Les galeries photos de nos événements apparaîtront ici.</p>
        </div>
        
        <div v-else class="gallery-list">
          <NuxtLink v-for="gallery in galleries" :key="gallery.id" :to="`/galleries/${gallery.id}`" class="gallery-card">
            <div class="gallery-card__cover" :style="gallery.coverImage ? { backgroundImage: `url(${gallery.coverImage})` } : {}">
              <span v-if="!gallery.coverImage" class="gallery-card__cover-placeholder">📸</span>
              
              <div class="gallery-card__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {{ gallery.imageCount || 0 }} photos
              </div>
            </div>
            
            <div class="gallery-card__body">
              <h3 class="gallery-card__title">{{ gallery.title }}</h3>
              <p v-if="gallery.description" class="gallery-card__desc line-clamp-2">
                {{ gallery.description }}
              </p>
              <div class="gallery-card__footer">
                <div class="gallery-card__date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <ClientOnly fallback="...">
                    {{ new Date(gallery.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </ClientOnly>
                </div>
                <span class="gallery-card__cta">Voir la galerie →</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: response, pending, error } = await useFetch<{ data: any[] }>('/api/galleries')
const galleries = computed(() => response.value?.data || [])

useHead({
  title: 'Galeries Photos | CAP ALI',
  meta: [
    { name: 'description', content: 'Revivez les moments forts de nos événements et rencontres communautaires.' }
  ]
})
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  padding: var(--space-24) 0 var(--space-16);
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 15% 10%, rgba(27, 107, 58, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 85% 30%, rgba(212, 175, 55, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 50% 90%, rgba(34, 197, 94, 0.04) 0%, transparent 60%);
  filter: blur(24px);
  pointer-events: none;
}
.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--neutral-900);
  line-height: 1.1;
  margin-bottom: var(--space-6);
  letter-spacing: -0.02em;
}
.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--neutral-600);
  line-height: 1.6;
}
.section__overtitle { margin-bottom: var(--space-4); }
.section__overtitle::before { display: none; }

/* Grid */
.gallery-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-8);
}

/* Card */
.gallery-card {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--neutral-100);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.gallery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  border-color: var(--green-200);
}

.gallery-card__cover {
  height: 220px;
  background: var(--neutral-100);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.gallery-card__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%);
  opacity: 0;
  transition: opacity 0.3s;
}
.gallery-card:hover .gallery-card__cover::after { opacity: 1; }

.gallery-card__cover-placeholder { font-size: 48px; opacity: 0.2; }

.gallery-card__badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: var(--neutral-900);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
}

.gallery-card__body {
  padding: var(--space-6);
  flex: 1;
  display: flex;
  flex-direction: column;
}
.gallery-card__title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-2);
  line-height: 1.3;
  transition: color 0.2s;
}
.gallery-card:hover .gallery-card__title { color: var(--green-600); }

.gallery-card__desc {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  margin-bottom: var(--space-6);
  line-height: 1.5;
}

.gallery-card__footer {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--neutral-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gallery-card__date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--neutral-500);
}
.gallery-card__date svg { color: var(--green-500); }

.gallery-card__cta {
  font-size: 13px;
  font-weight: 600;
  color: var(--green-600);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}
.gallery-card:hover .gallery-card__cta {
  opacity: 1;
  transform: translateX(0);
}
</style>
