<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <div class="admin-page__title-wrap">
        <h1 class="admin-page__title">Newsletter</h1>
        <p class="admin-page__subtitle">Gérez vos abonnés et envoyez des emails de masse.</p>
      </div>
      <div class="admin-page__actions">
        <button class="btn btn--primary" @click="openComposeModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          Envoyer un message
        </button>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nom / Prénom</th>
              <th>Email</th>
              <th>Source</th>
              <th>Date d'inscription</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subscribers" :key="sub.email">
              <td data-label="Nom / Prénom">
                <div class="user-cell">
                  <div class="user-avatar">{{ (sub.firstName || sub.email || '?').charAt(0).toUpperCase() }}</div>
                  <div class="user-name">{{ sub.firstName || 'Inconnu' }}</div>
                </div>
              </td>
              <td data-label="Email">{{ sub.email }}</td>
              <td data-label="Source"><span class="badge">{{ sub.source }}</span></td>
              <td data-label="Date d'inscription">{{ new Date(sub.createdAt).toLocaleDateString('fr-FR') }}</td>
            </tr>
            <tr v-if="!subscribers || subscribers.length === 0">
              <td colspan="4" style="text-align: center; padding: 30px;">Aucun abonné pour le moment.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UiBaseModal v-model="showComposeModal" title="Nouvelle Newsletter" maxWidth="750px">
      <form @submit.prevent="sendNewsletter" class="compose-form">
        <div class="f-field">
          <label class="f-label">Objet de l'email</label>
          <input v-model="form.subject" class="f-input" required placeholder="Ex: Nouveautés de ce mois-ci sur Cap Ali !">
        </div>

        <div class="f-field">
          <label class="f-label">Contenu de l'email</label>
          <div class="editor-wrap">
            <div v-if="editor" class="editor-toolbar">
              <button type="button" title="Gras" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
              </button>
              <button type="button" title="Italique" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
              </button>
              <button type="button" title="Souligné" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
              </button>
              
              <div class="toolbar-divider"></div>
              
              <button type="button" title="Titre 1" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                <span style="font-weight:800;font-size:15px;font-family:serif;display:block;line-height:1">T1</span>
              </button>
              <button type="button" title="Titre 2" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                <span style="font-weight:700;font-size:13px;font-family:serif;display:block;line-height:1">T2</span>
              </button>
              
              <div class="toolbar-divider"></div>
              
              <button type="button" title="Liste à puces" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
              <button type="button" title="Liste numérotée" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
              </button>
              
              <div class="toolbar-divider"></div>
              
              <button type="button" title="Insérer un lien web" @click="addLink" :class="{ 'is-active': editor.isActive('link') }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
              <button type="button" title="Insérer une image" @click="addImage">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </button>
              <button type="button" title="Joindre un document" @click="addDocument">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </button>
            </div>
            <editor-content :editor="editor" class="editor-content-area" />
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn--outline" @click="showComposeModal = false">Annuler</button>
          <button type="submit" class="btn btn--primary" :disabled="isSending">
            <span v-if="!isSending">Envoyer à {{ subscribers?.length || 0 }} abonné(s)</span>
            <span v-else>Envoi en cours...</span>
          </button>
        </div>
      </form>
    </UiBaseModal>

    <UiBaseModal v-model="showLinkModal" title="Insérer un lien">
      <div class="f-field">
        <label class="f-label">Adresse Web (URL)</label>
        <input v-model="linkUrl" class="f-input" placeholder="https://..." @keyup.enter="confirmLink" autofocus>
      </div>
      <div class="modal-actions">
        <button class="btn btn--outline" @click="showLinkModal = false">Annuler</button>
        <button class="btn btn--primary" @click="confirmLink">Insérer</button>
      </div>
    </UiBaseModal>

    <UiBaseModal v-model="showSuccessModal" title="Succès">
      <p style="margin-top: 10px;">{{ successMessage }}</p>
      <div class="modal-actions">
        <button class="btn btn--primary" @click="showSuccessModal = false">Fermer</button>
      </div>
    </UiBaseModal>

    <UiBaseModal v-model="showErrorModal" title="Erreur">
      <p style="margin-top: 10px; color: var(--danger, #e53e3e);">{{ errorMessage }}</p>
      <div class="modal-actions">
        <button class="btn btn--outline" @click="showErrorModal = false">Fermer</button>
      </div>
    </UiBaseModal>

    <!-- Hidden file inputs -->
    <input type="file" ref="imageInput" accept="image/*" style="display:none;" @change="handleImageUpload">
    <input type="file" ref="docInput" style="display:none;" @change="handleDocUpload">
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

definePageMeta({
  layout: 'admin',
})

const { data: subscribers } = await useFetch('/api/admin/newsletter/subscribers')

const showComposeModal = ref(false)
const isSending = ref(false)
const form = ref({ subject: '' })

const showLinkModal = ref(false)
const linkUrl = ref('')

const showSuccessModal = ref(false)
const successMessage = ref('')

const showErrorModal = ref(false)
const errorMessage = ref('')

const imageInput = ref<HTMLInputElement | null>(null)
const docInput = ref<HTMLInputElement | null>(null)

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Image,
    Placeholder.configure({
      placeholder: 'Rédigez votre newsletter...',
    })
  ],
})

function openComposeModal() {
  form.value.subject = ''
  editor.value?.commands.setContent('')
  showComposeModal.value = true
}

function addLink() {
  const previousUrl = editor.value?.getAttributes('link').href
  linkUrl.value = previousUrl || ''
  showLinkModal.value = true
}

function confirmLink() {
  if (!linkUrl.value) {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  } else {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.value }).run()
  }
  showLinkModal.value = false
}

function addImage() {
  imageInput.value?.click()
}

function addDocument() {
  docInput.value?.click()
}

async function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files.length) return
  const file = target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await $fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      query: { folder: 'newsletter_images' }
    })
    
    if (res?.data?.url) {
      if (!editor.value) return
      // Move selection to end of current selection to avoid overwriting
      const pos = editor.value.state.selection.to
      editor.value.chain()
        .focus()
        .setTextSelection(pos)
        .setImage({ src: res.data.url })
        .run()
    }
  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Erreur lors de l\'upload de l\'image.'
    showErrorModal.value = true
  } finally {
    target.value = '' // Reset input
  }
}

async function handleDocUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files.length) return
  const file = target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await $fetch('/api/upload/file', {
      method: 'POST',
      body: formData,
      query: { folder: 'newsletter_docs' }
    })
    
    if (res?.data?.url) {
      if (!editor.value) return
      // Prevent overwriting a selected image by collapsing the selection first
      const pos = editor.value.state.selection.to
      editor.value.chain()
        .focus()
        .setTextSelection(pos)
        .insertContent(` <a href="${res.data.url}" target="_blank" rel="noopener noreferrer">📄 ${res.data.name}</a> `)
        .run()
    }
  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Erreur lors de l\'upload du document.'
    showErrorModal.value = true
  } finally {
    target.value = '' // Reset input
  }
}

async function sendNewsletter() {
  if (!editor.value || !form.value.subject) return
  
  const htmlContent = editor.value.getHTML()
  if (!htmlContent || htmlContent === '<p></p>') {
    errorMessage.value = 'Le contenu de l\'email ne peut pas être vide.'
    showErrorModal.value = true
    return
  }

  isSending.value = true
  try {
    const res = await $fetch('/api/admin/newsletter/send', {
      method: 'POST',
      body: {
        subject: form.value.subject,
        html: htmlContent,
        recipientEmails: subscribers.value?.map(s => s.email) || []
      }
    })
    successMessage.value = res.message || 'Newsletter envoyée avec succès.'
    showSuccessModal.value = true
    showComposeModal.value = false
  } catch (e: any) {
    errorMessage.value = e.data?.message || 'Erreur lors de l\'envoi'
    showErrorModal.value = true
  } finally {
    isSending.value = false
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.f-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.f-label {
  font-weight: 600;
  color: var(--forest, #1C4A35);
  font-size: 14px;
}

.f-input {
  padding: 12px 16px;
  border: 1px solid var(--border, #cbd5e1);
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.f-input:focus {
  outline: none;
  border-color: var(--gold, #C9A84C);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
}

.admin-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  overflow: hidden;
  margin-top: 20px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th, .admin-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--border, #eee);
  font-size: 14px;
}

.admin-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: var(--forest, #1C4A35);
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gold, #C9A84C);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.user-name {
  font-weight: 600;
  color: var(--forest, #1C4A35);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  background: var(--cream);
  color: var(--forest);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.compose-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.editor-wrap {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: #f8f9fa;
  border-bottom: 1px solid var(--border);
}

.editor-toolbar button {
  padding: 6px 10px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background: #ebeef2;
}

.editor-toolbar button.is-active {
  background: #e2e8f0;
  color: var(--forest);
  font-weight: bold;
}

.toolbar-divider {
  width: 1px;
  background: #cbd5e1;
  margin: 4px;
}

.editor-content-area {
  padding: 16px 20px;
  min-height: 250px;
  max-height: 45vh;
  overflow-y: auto;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
}

.editor-content-area :deep(.ProseMirror) {
  outline: none;
}

.editor-content-area :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.editor-content-area :deep(.ProseMirror p) {
  margin-bottom: 1em;
}

.editor-content-area :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
</style>
