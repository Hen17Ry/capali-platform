<template>
  <div v-if="isOpen" class="donation-modal-overlay" @click.self="close">
    <div class="donation-modal">
      <button class="donation-modal__close" aria-label="Fermer" @click="close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="donation-modal__header">
        <h2 class="donation-modal__title">Faire un don</h2>
        <p class="donation-modal__subtitle">Soutenez la communauté CAP ALI et aidez-nous à accompagner plus de jeunes dans leur parcours.</p>
      </div>

      <!-- Étape 1 : Choix du moyen de paiement -->
      <div v-if="step === 'method'" class="donation-modal__step">
        <h3 class="step-title">Choisissez votre moyen de paiement</h3>
        <div class="payment-methods">
          <button class="payment-method-btn stripe" @click="selectMethod('stripe')">
            <span class="method-icon">💳</span>
            <div class="method-info">
              <span class="method-name">Carte bancaire (Stripe)</span>
              <span class="method-desc">Paiement sécurisé international</span>
            </div>
          </button>
          <button class="payment-method-btn kkiapay" @click="selectMethod('kkiapay')">
            <span class="method-icon">📱</span>
            <div class="method-info">
              <span class="method-name">Mobile Money (Kkiapay)</span>
              <span class="method-desc">MTN, Moov, Celtiis</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Étape 2 : Formulaire de détails -->
      <div v-if="step === 'details'" class="donation-modal__step">
        <button class="back-btn" @click="step = 'method'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>

        <form class="donation-form" @submit.prevent="submitDonation">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input id="firstName" v-model="form.firstName" type="text" required placeholder="Votre prénom" >
            </div>
            <div class="form-group">
              <label for="lastName">Nom</label>
              <input id="lastName" v-model="form.lastName" type="text" required placeholder="Votre nom" >
            </div>
          </div>
          <div class="form-group">
            <label for="email">Adresse email</label>
            <input id="email" v-model="form.email" type="email" required placeholder="votre@email.com" >
          </div>

          <div class="form-group mt-4">
            <label>Montant de votre don (€)</label>
            <div class="amount-grid">
              <button 
                v-for="amt in predefinedAmounts" 
                :key="amt" 
                type="button" 
                class="amount-btn" 
                :class="{ 'amount-btn--active': !isCustomAmount && form.amount === amt }"
                @click="selectAmount(amt)"
              >
                {{ amt }} €
              </button>
              <button 
                type="button" 
                class="amount-btn amount-btn--custom"
                :class="{ 'amount-btn--active': isCustomAmount }"
                @click="isCustomAmount = true"
              >
                Autre
              </button>
            </div>
            
            <div v-if="isCustomAmount" class="custom-amount-wrapper mt-3">
              <span class="currency-symbol">€</span>
              <input 
                v-model="form.amount" 
                type="number" 
                min="1" 
                step="1" 
                class="custom-amount-input" 
                placeholder="Montant libre"
                required
              >
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--full mt-6" :disabled="isLoading">
            <span v-if="isLoading">Préparation du paiement...</span>
            <span v-else>Valider et payer {{ form.amount }} €</span>
          </button>
        </form>
      </div>



    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const { isOpen, close } = useDonationModal()

const step = ref<'method' | 'details'>('method')
const selectedMethod = ref<'stripe' | 'kkiapay' | null>(null)
const isLoading = ref(false)

const predefinedAmounts = [2, 5, 10, 20, 50]
const isCustomAmount = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  amount: 10
})

watch(isOpen, (val) => {
  if (val) {
    step.value = 'method'
    isLoading.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function selectMethod(m: 'stripe' | 'kkiapay') {
  selectedMethod.value = m
  step.value = 'details'
}

function selectAmount(amt: number) {
  isCustomAmount.value = false
  form.amount = amt
}

async function submitDonation() {
  if (!form.firstName || !form.lastName || !form.email || form.amount <= 0) return
  
  if (selectedMethod.value === 'stripe') {
    await submitStripe()
  } else if (selectedMethod.value === 'kkiapay') {
    await submitKkiapay()
  }
}

async function submitStripe() {
  try {
    isLoading.value = true
    const { data, error } = await useFetch<{ url: string }>('/api/donate/stripe', {
      method: 'POST',
      body: form
    })

    if (error.value || !data.value?.url) {
      alert("Une erreur est survenue lors de l'initialisation du paiement.")
      isLoading.value = false
      return
    }

    // Redirect to Stripe Checkout
    window.location.href = data.value.url
  } catch (err) {
    console.error(err)
    alert("Une erreur est survenue.")
    isLoading.value = false
  }
}

async function submitKkiapay() {
  try {
    isLoading.value = true
    
    // Convert amount from EUR to XOF for Kkiapay (1 EUR ≈ 655.957 XOF)
    // We round to the nearest whole number since Kkiapay expects integers
    const amountXOF = Math.round(form.amount * 655.957)

    // First create a pending record in our DB
    const { data, error } = await useFetch<{ id: string }>('/api/donate/kkiapay', {
      method: 'POST',
      body: { ...form, amountXOF }
    })

    if (error.value || !data.value?.id) {
      alert("Erreur d'initialisation du paiement.")
      isLoading.value = false
      return
    }

    const config = useRuntimeConfig()
    
    // Call Kkiapay widget function loaded via CDN
    // @ts-expect-error Kkiapay is loaded via CDN script in the head
    window.openKkiapayWidget({
      amount: amountXOF,
      api_key: config.public.kkiapayPublicKey || 'sandbox_key',
      sandbox: true,
      email: form.email,
      phone: "", // Let the user input it in the widget
      name: `${form.firstName} ${form.lastName}`,
      data: data.value.id, // We pass our donation ID
      theme: "#1B6B3A", // Cap Ali Green
      callback: `${config.public.appUrl}/donate/success?method=kkiapay&donation_id=${data.value.id}`
    })

    isLoading.value = false
    close() // Close our modal so Kkiapay modal shows clearly
  } catch (err) {
    console.error(err)
    alert("Erreur avec Kkiapay.")
    isLoading.value = false
  }
}
</script>

<style scoped>
.donation-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-4);
}

.donation-modal {
  background: var(--neutral-0);
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: modal-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-up {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.donation-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-100);
  color: var(--neutral-500);
  transition: all 0.2s;
  z-index: 10;
}
.donation-modal__close:hover {
  background: var(--neutral-200);
  color: var(--neutral-900);
}

.donation-modal__header {
  padding: var(--space-8) var(--space-8) var(--space-6);
  text-align: center;
  background: linear-gradient(135deg, var(--green-800), var(--green-600));
  color: white;
}

.donation-modal__title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.donation-modal__subtitle {
  font-size: var(--text-sm);
  opacity: 0.9;
  line-height: 1.5;
}

.donation-modal__step {
  padding: var(--space-6) var(--space-8) var(--space-8);
  overflow-y: auto;
}

.step-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: var(--space-4);
  text-align: center;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.payment-method-btn {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  text-align: left;
  transition: all 0.2s;
}
.payment-method-btn:hover {
  border-color: var(--green-500);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.method-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-100);
  border-radius: 50%;
}

.method-name {
  display: block;
  font-weight: 600;
  color: var(--neutral-900);
  font-size: var(--text-base);
}

.method-desc {
  display: block;
  font-size: var(--text-xs);
  color: var(--neutral-500);
  margin-top: 2px;
}

/* Forms */
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--neutral-500);
  font-size: var(--text-sm);
  font-weight: 500;
  margin-bottom: var(--space-4);
  transition: color 0.2s;
}
.back-btn:hover { color: var(--neutral-900); }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  margin-bottom: var(--space-4);
}
.form-group label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 6px;
}
.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all 0.2s;
  outline: none;
}
.form-group input:focus {
  border-color: var(--green-500);
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.1);
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.amount-btn {
  padding: 12px 8px;
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  font-weight: 600;
  color: var(--neutral-700);
  transition: all 0.2s;
}
.amount-btn:hover {
  background: var(--neutral-100);
}
.amount-btn--active {
  background: var(--green-600) !important;
  color: white !important;
  border-color: var(--green-700) !important;
}

.custom-amount-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.currency-symbol {
  position: absolute;
  left: 14px;
  color: var(--neutral-500);
  font-weight: 600;
}
.custom-amount-input {
  padding-left: 32px !important;
}

.kkiapay-placeholder {
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--neutral-500);
}

.btn--full {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px;
  font-size: var(--text-base);
}
</style>
