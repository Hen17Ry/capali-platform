<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modal-close" @click="close">✕</button>
      
      <h2 class="modal-title">Inscription à l'événement</h2>
      <p class="modal-subtitle">{{ event.title }}</p>
      
      <div v-if="event.isPaid" class="price-banner">
        Tarif : <strong>{{ event.priceEur }} €</strong>
      </div>
      
      <form v-if="!paymentPending" class="register-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">Nom complet *</label>
          <input v-model="form.name" type="text" class="form-input" required placeholder="Jean Dupont">
        </div>
        
        <div class="form-group">
          <label class="form-label">Adresse Email *</label>
          <input v-model="form.email" type="email" class="form-input" required placeholder="jean.dupont@example.com">
        </div>
        
        <div class="form-group">
          <label class="form-label">Téléphone (Optionnel)</label>
          <input v-model="form.phone" type="tel" class="form-input" placeholder="+229 ...">
        </div>
        
        <div class="form-group">
          <label class="form-label">Profession / Études (Optionnel)</label>
          <input v-model="form.profession" type="text" class="form-input" placeholder="Ex: Développeur Web">
        </div>
        
        <div v-if="event.isPaid" class="form-group payment-methods">
          <label class="form-label">Moyen de paiement *</label>
          <div class="payment-options">
            <label class="payment-option" :class="{ 'is-active': form.paymentProvider === 'stripe' }">
              <input v-model="form.paymentProvider" type="radio" value="stripe" name="payment_method" required>
              <div class="option-content">
                <span class="option-title">Carte Bancaire (Stripe)</span>
                <span class="option-desc">Paiement international sécurisé</span>
              </div>
            </label>
            <label class="payment-option" :class="{ 'is-active': form.paymentProvider === 'kkiapay' }">
              <input v-model="form.paymentProvider" type="radio" value="kkiapay" name="payment_method" required>
              <div class="option-content">
                <span class="option-title">Mobile Money (Kkiapay)</span>
                <span class="option-desc">MTN, Moov, Wave (Afrique)</span>
              </div>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn--outline" @click="close">Annuler</button>
          <button type="submit" class="btn btn--primary" :disabled="loading">
            {{ loading ? 'Chargement...' : (event.isPaid ? 'Payer ' + event.priceEur + ' €' : 'S\'inscrire gratuitement') }}
          </button>
        </div>
      </form>
      
      <!-- Widget Container Kkiapay -->
      <div v-show="paymentPending && form.paymentProvider === 'kkiapay'" id="kkiapay-widget-container" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  event: any
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const { user } = useAuth()
const config = useRuntimeConfig()

const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: '',
  profession: '',
  paymentProvider: 'stripe'
})

const loading = ref(false)
const paymentPending = ref(false)
const attendeeIdRef = ref<string>('')

watch(() => props.modelValue, (val) => {
  if (val && user.value) {
    form.name = user.value.name || ''
    form.email = user.value.email || ''
  }
  if (!val) {
    paymentPending.value = false
  }
})

function close() {
  emit('update:modelValue', false)
}

async function submitForm() {
  loading.value = true
  try {
    const res = await $fetch<any>(`/api/events/${props.event.id}/register`, {
      method: 'POST',
      body: form
    })
    
    if (res.status === 'free') {
      alert('Inscription réussie ! Vous recevrez un email de confirmation.')
      emit('success')
      close()
    } else if (res.status === 'pending') {
      if (res.provider === 'stripe') {
        window.location.href = res.checkoutUrl
      } else if (res.provider === 'kkiapay') {
        attendeeIdRef.value = res.attendeeId
        paymentPending.value = true
        initKkiapay(res.amountEur, res.attendeeId)
      }
    }
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Erreur lors de l\'inscription.')
  } finally {
    loading.value = false
  }
}

// Fonction pour initialiser Kkiapay dynamiquement
function initKkiapay(amountEur: number, attendeeId: string) {
  // Charger le script si pas encore fait
  if (!window.openKkiapayWidget) {
    const script = document.createElement('script')
    script.src = 'https://cdn.kkiapay.me/k.js'
    script.onload = () => openKkiapay(amountEur, attendeeId)
    document.body.appendChild(script)
  } else {
    openKkiapay(amountEur, attendeeId)
  }
}

function openKkiapay(amountEur: number, attendeeId: string) {
  const amountXof = Math.round(amountEur * 655.957)
  
  const baseUrl = window.location.origin
  
  window.openKkiapayWidget({
    amount: amountXof,
    key: config.public.kkiapayPublicKey || 'sandbox_key',
    sandbox: true,
    email: form.email,
    phone: form.phone,
    name: form.name,
    data: attendeeId,
    theme: "#1b6b3a",
    callback: `${baseUrl}/events/${props.event.id}?payment=kkiapay_success&attendeeId=${attendeeId}`
  })
  
  close()
}

// Declaration pour typescript
declare global {
  interface Window {
    openKkiapayWidget?: any
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  padding: var(--space-4);
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 500px;
  padding: var(--space-8);
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute; top: var(--space-4); right: var(--space-4);
  background: var(--neutral-100); border: none;
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--neutral-600);
  transition: all 0.2s;
}

.modal-close:hover { background: var(--neutral-200); color: var(--neutral-900); }

.modal-title { font-size: var(--text-xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.modal-subtitle { font-size: var(--text-sm); color: var(--neutral-500); margin-bottom: var(--space-6); font-family: var(--font-serif); }

.price-banner {
  background: var(--gold-50);
  border: 1px solid var(--gold-200);
  color: var(--gold-800);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-6);
  text-align: center;
  font-size: var(--text-lg);
}

.form-group { margin-bottom: var(--space-5); }
.form-label { display: block; font-size: var(--text-sm); font-weight: 600; color: var(--neutral-700); margin-bottom: var(--space-2); }
.form-input { 
  width: 100%; padding: var(--space-3); 
  border: 1px solid var(--neutral-200); border-radius: var(--radius-md); 
  transition: all 0.2s; 
}
.form-input:focus { outline: none; border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }

.payment-options { display: flex; flex-direction: column; gap: var(--space-3); }
.payment-option {
  display: flex; gap: var(--space-3); align-items: flex-start;
  padding: var(--space-4); border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;
}
.payment-option:hover { border-color: var(--neutral-300); }
.payment-option.is-active { border-color: var(--green-600); background: var(--green-50); }
.payment-option input { margin-top: 4px; accent-color: var(--green-600); }
.option-content { display: flex; flex-direction: column; }
.option-title { font-weight: 600; color: var(--neutral-900); }
.option-desc { font-size: 13px; color: var(--neutral-500); }

.form-actions { display: flex; gap: var(--space-3); margin-top: var(--space-8); }
.form-actions button { flex: 1; }
</style>
