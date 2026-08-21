<template>
  <div class="page-wrapper bg-neutral-0 min-h-screen">
    
    <div v-if="pending" class="h-screen flex items-center justify-center text-neutral-500">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Chargement de la galerie...
      </div>
    </div>
    <div v-else-if="error || !gallery" class="h-screen flex flex-col items-center justify-center text-center">
      <h1 class="text-3xl font-bold text-neutral-900 mb-4">Galerie introuvable</h1>
      <NuxtLink to="/galleries" class="btn btn--primary">Retour aux galeries</NuxtLink>
    </div>
    
    <template v-else>
      <!-- Header Section -->
      <section class="gallery-header" :style="gallery.coverImage || gallery.images?.[0] ? { backgroundImage: `url(${gallery.coverImage || gallery.images[0]})` } : {}">
        <div class="gallery-header__overlay"/>
        <div class="container relative z-10 pt-20 pb-16">
          <div class="max-w-4xl mx-auto text-center">
            <NuxtLink to="/galleries" class="back-btn mb-8">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Toutes les galeries
            </NuxtLink>
            
            <h1 class="gallery-title">
              {{ gallery.eventTitle || 'Galerie' }}
            </h1>
            <p v-if="gallery.description" class="gallery-desc">
              {{ gallery.description }}
            </p>
            
            <div class="gallery-meta">
              <div class="meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {{ gallery.images?.length || 0 }} photos
              </div>
              <div v-if="gallery.createdAt" class="meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <ClientOnly fallback="Chargement de la date...">
                  {{ new Date(gallery.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Grid Section -->
      <section class="section py-16">
        <div class="container">
          <div class="photo-grid">
            <div v-for="(img, idx) in gallery?.images || []" :key="idx" class="photo-card group" @click="openImage(idx)">
              <div class="photo-card__inner">
                <img :src="img" class="photo-card__img" loading="lazy" >
                <div class="photo-card__overlay">
                  <div class="photo-card__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Modal Visionneuse -->
      <Teleport to="body">
        <Transition name="lightbox">
          <div
            v-if="isModalOpen"
            class="lightbox"
            role="dialog"
            aria-modal="true"
            @click.self="closeModal"
          >
            <!-- Fermer -->
            <button
              type="button"
              class="lightbox__close"
              aria-label="Fermer la galerie"
              @click="closeModal"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <!-- Flèche gauche -->
            <button
              v-if="gallery?.images && gallery.images.length > 1"
              type="button"
              class="lightbox__nav lightbox__nav--prev"
              aria-label="Image précédente"
              @click.stop="prevImage"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <!-- Zone centrale -->
            <div class="lightbox__content" @click.stop>
              <div class="lightbox__image-wrapper">
                <img
                  v-if="gallery?.images?.[currentImageIndex]"
                  :key="currentImageIndex"
                  :src="gallery.images[currentImageIndex]"
                  :alt="`Photo ${currentImageIndex + 1} de la galerie`"
                  class="lightbox__image"
                  draggable="false"
                >
              </div>

              <!-- Informations -->
              <div class="lightbox__bottom">
                <div class="lightbox__counter">
                  {{ currentImageIndex + 1 }}
                  <span>/</span>
                  {{ gallery?.images?.length || 0 }}
                </div>

                <!-- Miniatures -->
                <div
                  v-if="gallery?.images && gallery.images.length > 1"
                  class="lightbox__thumbnails"
                >
                  <button
                    v-for="(image, index) in gallery.images"
                    :key="index"
                    type="button"
                    class="lightbox__thumbnail"
                    :class="{
                      'lightbox__thumbnail--active':
                        currentImageIndex === index
                    }"
                    @click="currentImageIndex = index"
                  >
                    <img
                      :src="image"
                      :alt="`Miniature ${index + 1}`"
                    >
                  </button>
                </div>
              </div>
            </div>

            <!-- Flèche droite -->
            <button
              v-if="gallery?.images && gallery.images.length > 1"
              type="button"
              class="lightbox__nav lightbox__nav--next"
              aria-label="Image suivante"
              @click.stop="nextImage"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </Transition>
      </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

interface GalleryData {
  id: string;
  eventId: string;
  eventTitle?: string;
  description?: string;
  images: string[];
  coverImage?: string;
  createdAt: string;
}

const { data: response, pending, error } = await useFetch<{ data: GalleryData }>(`/api/galleries/${id}`)
const gallery = computed(() => response.value?.data)

useHead({
  title: computed(() => (gallery.value?.eventTitle ? `${gallery.value.eventTitle} | Galeries` : 'Galerie | CAP ALI'))
})

// Logique Modal
const isModalOpen = ref(false)
const currentImageIndex = ref(0)

function openImage(index: number) {
  currentImageIndex.value = index
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
}

function closeModal() {
  isModalOpen.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
}

function nextImage() {
  if (!gallery.value?.images) return
  currentImageIndex.value = (currentImageIndex.value + 1) % gallery.value.images.length
}

function prevImage() {
  if (!gallery.value?.images) return
  currentImageIndex.value = (currentImageIndex.value - 1 + gallery.value.images.length) % gallery.value.images.length
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onUnmounted(() => {
  if (isModalOpen.value) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Header */
.gallery-header {
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: var(--neutral-900);
  min-height: 400px;
  display: flex;
  align-items: center;
}
.gallery-header__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}
.back-btn:hover {
  color: white;
  background: rgba(255,255,255,0.2);
}

.gallery-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: var(--space-4);
  text-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.gallery-desc {
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.gallery-meta {
  margin-top: var(--space-8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.8);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Grid */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

.photo-card {
  cursor: pointer;
  perspective: 1000px;
}
.photo-card__inner {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--neutral-100);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease;
}
.photo-card:hover .photo-card__inner {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 32px rgba(0,0,0,0.1);
}

.photo-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.photo-card:hover .photo-card__img {
  transform: scale(1.05);
}

.photo-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}
.photo-card:hover .photo-card__overlay { opacity: 1; }

.photo-card__icon {
  background: rgba(255,255,255,0.95);
  color: var(--neutral-900);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(16px);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
.photo-card:hover .photo-card__icon {
  transform: translateY(0);
}

/* =========================
   LIGHTBOX / MODAL GALERIE
   ========================= */

.lightbox {
  position: fixed;
  inset: 0;

  width: 100vw;
  height: 100vh;
  height: 100dvh;

  z-index: 999999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(5, 5, 5, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  overflow: hidden;
}

/* Zone centrale */
.lightbox__content {
  position: relative;

  width: min(1100px, calc(100vw - 160px));
  height: calc(100dvh - 70px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 18px;
}

/* Conteneur de l'image */
.lightbox__image-wrapper {
  width: 100%;
  flex: 1;

  min-height: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* Image */
.lightbox__image {
  display: block;

  width: auto;
  height: auto;

  max-width: 100%;
  max-height: calc(100dvh - 190px);

  object-fit: contain;

  border-radius: 12px;

  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.05);

  user-select: none;

  animation: lightboxImageIn 0.25s ease;
}

/* Fermer */
.lightbox__close {
  position: fixed;

  top: 24px;
  right: 28px;

  z-index: 10;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.1);
  color: white;

  cursor: pointer;

  backdrop-filter: blur(10px);

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.lightbox__close svg {
  width: 23px;
  height: 23px;
}

/* Flèches */
.lightbox__nav {
  position: fixed;

  top: 50%;
  transform: translateY(-50%);

  z-index: 10;

  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.1);
  color: white;

  cursor: pointer;

  backdrop-filter: blur(10px);

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-50%) scale(1.06);
}

.lightbox__nav svg {
  width: 28px;
  height: 28px;
}

.lightbox__nav--prev {
  left: 28px;
}

.lightbox__nav--next {
  right: 28px;
}

/* Partie basse */
.lightbox__bottom {
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 12px;

  max-width: 100%;
}

/* Compteur */
.lightbox__counter {
  color: rgba(255, 255, 255, 0.9);

  font-size: 13px;
  font-weight: 600;

  padding: 7px 14px;

  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;

  backdrop-filter: blur(8px);
}

.lightbox__counter span {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}

/* Miniatures */
.lightbox__thumbnails {
  display: flex;
  align-items: center;

  gap: 8px;

  max-width: min(750px, 80vw);

  padding: 4px;

  overflow-x: auto;

  scrollbar-width: none;
}

.lightbox__thumbnails::-webkit-scrollbar {
  display: none;
}

.lightbox__thumbnail {
  width: 58px;
  height: 44px;

  flex: 0 0 auto;

  padding: 0;

  overflow: hidden;

  border: 2px solid transparent;
  border-radius: 7px;

  background: transparent;

  cursor: pointer;

  opacity: 0.45;

  transition:
    opacity 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.lightbox__thumbnail:hover {
  opacity: 0.8;
}

.lightbox__thumbnail--active {
  opacity: 1;

  border-color: #fff;

  transform: translateY(-2px);
}

.lightbox__thumbnail img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

/* Animation générale */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@keyframes lightboxImageIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* =========================
   TABLETTE
   ========================= */

@media (max-width: 900px) {
  .lightbox__content {
    width: calc(100vw - 110px);
    height: calc(100dvh - 50px);
  }

  .lightbox__image {
    max-height: calc(100dvh - 170px);
  }

  .lightbox__nav {
    width: 46px;
    height: 46px;
  }

  .lightbox__nav--prev {
    left: 15px;
  }

  .lightbox__nav--next {
    right: 15px;
  }
}

/* =========================
   MOBILE
   ========================= */

@media (max-width: 640px) {
  .lightbox {
    align-items: center;
  }

  .lightbox__content {
    width: 100%;
    height: 100dvh;

    padding:
      70px
      14px
      18px;
  }

  .lightbox__image-wrapper {
    width: 100%;
  }

  .lightbox__image {
    max-width: 100%;
    max-height: calc(100dvh - 210px);

    border-radius: 8px;
  }

  .lightbox__close {
    top: 16px;
    right: 16px;

    width: 42px;
    height: 42px;
  }

  .lightbox__nav {
    width: 42px;
    height: 42px;

    background: rgba(0, 0, 0, 0.45);
  }

  .lightbox__nav--prev {
    left: 10px;
  }

  .lightbox__nav--next {
    right: 10px;
  }

  .lightbox__thumbnail {
    width: 50px;
    height: 38px;
  }

  .lightbox__thumbnails {
    max-width: calc(100vw - 28px);
  }
}
</style>
