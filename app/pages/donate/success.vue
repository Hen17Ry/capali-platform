<template>
  <div class="donate-success">
    <div class="container text-center py-20">
      <div class="icon-wrapper">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <h1 class="text-4xl font-serif font-bold text-neutral-900 mb-4">Merci pour votre don !</h1>
      <p class="text-lg text-neutral-600 mb-8 max-w-lg mx-auto">
        Votre générosité nous permet de continuer à accompagner la jeunesse africaine. Vous recevrez très bientôt un reçu de votre paiement par email.
      </p>
      <NuxtLink to="/" class="btn btn--primary">
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({
  title: 'Merci pour votre don ! — CAP ALI'
})

onMounted(async () => {
  const method = route.query.method as string
  const sessionId = route.query.session_id
  const transactionId = route.query.transaction_id
  const donationId = route.query.donation_id
  
  if (method === 'kkiapay' && transactionId && donationId) {
    try {
      await $fetch('/api/donate/verify-kkiapay', {
        method: 'POST',
        body: { transactionId, donationId }
      })
    } catch (err) {
      console.error('Erreur lors de la vérification Kkiapay:', err)
    }
  } else if (sessionId) {
    try {
      // Vérification Stripe
      await $fetch('/api/donate/verify', {
        method: 'POST',
        body: { sessionId }
      })
    } catch (err) {
      console.error('Erreur lors de la vérification Stripe:', err)
    }
  }
})
</script>

<style scoped>
.donate-success {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-50);
}
.icon-wrapper {
  width: 96px;
  height: 96px;
  background: var(--green-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.icon-wrapper svg {
  color: var(--green-600);
  width: 48px;
  height: 48px;
}
@keyframes scale-up {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
</style>
