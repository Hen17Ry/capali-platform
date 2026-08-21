<template>
  <div v-if="showInstallPrompt" class="pwa-prompt-overlay">
    <div class="pwa-prompt-card">
      <div class="pwa-prompt-icon">
        <NuxtImg src="/logo.png" alt="CAP ALI" width="60" height="60" />
      </div>
      <div class="pwa-prompt-content">
        <h3>Installer CAP ALI</h3>
        <p>Installez notre application sur votre écran d'accueil pour y accéder plus rapidement et profiter d'une meilleure expérience.</p>
      </div>
      <div class="pwa-prompt-actions">
        <button class="btn btn--outline" @click="dismissPrompt">Plus tard</button>
        <button class="btn btn--primary" @click="installPwa">Installer</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showInstallPrompt = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  // Écouter l'événement d'installation PWA (Chrome/Edge/Android)
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage automatique de la bannière native
    e.preventDefault()
    // Sauvegarder l'événement pour le déclencher plus tard
    deferredPrompt = e
    // Afficher notre propre interface d'installation
    showInstallPrompt.value = true
  })
})

const installPwa = async () => {
  if (!deferredPrompt) return
  
  // Cacher le prompt
  showInstallPrompt.value = false
  // Afficher le prompt natif du navigateur
  deferredPrompt.prompt()
  // Attendre la réponse de l'utilisateur
  const { outcome } = await deferredPrompt.userChoice
  // eslint-disable-next-line no-console
  console.log(`PWA installation: ${outcome}`)
  // Réinitialiser la variable
  deferredPrompt = null
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
}
</script>

<style scoped>
.pwa-prompt-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem;
  display: flex;
  justify-content: center;
  pointer-events: none; /* Laisse passer les clics autour */
}

.pwa-prompt-card {
  pointer-events: auto; /* Rend la carte cliquable */
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3);
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  border: 1px solid var(--neutral-100);
}

.pwa-prompt-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pwa-prompt-icon img {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.pwa-prompt-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neutral-900);
  text-align: center;
  margin-bottom: 0.5rem;
}

.pwa-prompt-content p {
  font-size: 0.95rem;
  color: var(--neutral-600);
  text-align: center;
  line-height: 1.5;
}

.pwa-prompt-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.pwa-prompt-actions button {
  flex: 1;
}

@keyframes slideUp {
  from {
    transform: translateY(150%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
