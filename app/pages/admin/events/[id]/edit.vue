<template>
  <div>
    <div class="admin-page-header">
      <div>
        <NuxtLink to="/admin/events" class="back-link">← Retour aux événements</NuxtLink>
        <h1 class="admin-page-title">{{ isEdit ? 'Modifier l\'événement' : 'Nouvel événement' }}</h1>
      </div>
    </div>

    <form class="event-form" @submit.prevent="submitForm">
      <div class="form-card" style="max-width: 640px">
        <div class="form-group">
          <label class="form-label">Titre *</label>
          <input v-model="form.title" type="text" class="form-input" placeholder="Titre de l'événement" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="form-textarea" rows="6" placeholder="Description de l'événement" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Type *</label>
            <select v-model="form.type" class="form-select" required>
              <option value="workshop">Atelier</option>
              <option value="networking">Networking</option>
              <option value="webinar">Webinaire</option>
              <option value="conference">Conférence</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Ville</label>
            <input v-model="form.city" type="text" class="form-input" placeholder="Laissez vide si en ligne" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date et heure *</label>
            <input v-model="form.eventDate" type="datetime-local" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Lien d'inscription</label>
            <input v-model="form.registrationUrl" type="url" class="form-input" placeholder="https://..." />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">{{ isEdit ? 'Mettre à jour' : 'Créer l\'événement' }}</button>
          <NuxtLink to="/admin/events" class="btn btn--outline">Annuler</NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  description: '',
  type: 'workshop',
  city: '',
  eventDate: '',
  registrationUrl: '',
})

if (isEdit.value) {
  const { data } = await useFetch(`/api/admin/events/${route.params.id}`)
  if (data.value?.data) {
    const d = data.value.data
    Object.assign(form, { ...d, eventDate: d.eventDate ? new Date(d.eventDate).toISOString().slice(0, 16) : '' })
  }
}

async function submitForm() {
  try {
    if (isEdit.value) {
      await $fetch(`/api/admin/events/${route.params.id}`, { method: 'PATCH', body: form })
    } else {
      await $fetch('/api/admin/events', { method: 'POST', body: form })
    }
    router.push('/admin/events')
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Erreur lors de la sauvegarde.')
  }
}
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-6); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 700; color: var(--neutral-900); }
.back-link { font-size: var(--text-sm); color: var(--neutral-500); display: inline-block; margin-bottom: var(--space-2); }
.back-link:hover { color: var(--green-600); }
.form-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); }
.form-group { margin-bottom: var(--space-4); }
.form-label { display: block; font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); margin-bottom: var(--space-2); }
.form-input, .form-select, .form-textarea { width: 100%; padding: var(--space-3); font-size: var(--text-sm); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); color: var(--neutral-800); font-family: var(--font-sans); }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--green-400); box-shadow: 0 0 0 3px rgba(27,107,58,0.1); }
.form-textarea { resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-actions { display: flex; gap: var(--space-3); margin-top: var(--space-6); }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>
