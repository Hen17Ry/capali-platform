<template>
  <div class="rich-editor">
    <!-- Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <div class="toolbar-group">
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()" title="Gras">
          <strong>B</strong>
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()" title="Italique">
          <em>I</em>
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()" title="Souligné">
          <span style="text-decoration:underline;">U</span>
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()" title="Barré">
          <span style="text-decoration:line-through;">S</span>
        </button>
      </div>

      <div class="toolbar-sep" />

      <div class="toolbar-group">
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="Titre 2">
          H2
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="Titre 3">
          H3
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 4 }) }" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" title="Titre 4">
          H4
        </button>
      </div>

      <div class="toolbar-sep" />

      <div class="toolbar-group">
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()" title="Liste à puces">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()" title="Liste numérotée">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" font-size="8" fill="currentColor" stroke="none">1</text><text x="2" y="14" font-size="8" fill="currentColor" stroke="none">2</text><text x="2" y="20" font-size="8" fill="currentColor" stroke="none">3</text></svg>
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()" title="Citation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>
        </button>
      </div>

      <div class="toolbar-sep" />

      <div class="toolbar-group">
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()" title="Aligner à gauche">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
        </button>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()" title="Centrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
        </button>
      </div>

      <div class="toolbar-sep" />

      <div class="toolbar-group">
        <button type="button" class="toolbar-btn" @click="addLink" title="Ajouter un lien">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button type="button" class="toolbar-btn" @click="triggerImageUpload" title="Insérer une image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="uploadImage" />
      </div>

      <div class="toolbar-sep" />

      <div class="toolbar-group">
        <label class="toolbar-color" title="Couleur du texte">
          <span class="toolbar-color__preview" :style="{ background: currentColor }" />
          <input type="color" :value="currentColor" @input="setColor($event)" />
        </label>
        <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('highlight') }" @click="editor.chain().focus().toggleHighlight({ color: '#fef3c7' }).run()" title="Surligner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
      </div>

      <div class="toolbar-sep" />

      <div class="toolbar-group">
        <button type="button" class="toolbar-btn" @click="editor.chain().focus().setHorizontalRule().run()" title="Ligne horizontale">
          —
        </button>
        <button type="button" class="toolbar-btn" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="Annuler">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </button>
        <button type="button" class="toolbar-btn" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="Refaire">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
      </div>
    </div>

    <!-- Editor content -->
    <div class="editor-content-wrapper" :class="{ 'is-uploading': uploading }">
      <EditorContent :editor="editor" class="editor-content" />
      <div v-if="uploading" class="editor-uploading">
        <div class="editor-uploading__spinner" />
        <span>Upload en cours...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const imageInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const currentColor = ref('#1e293b')

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
    }),
    Image.configure({ inline: false, allowBase64: false }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Placeholder.configure({ placeholder: props.placeholder || 'Commencez à rédiger votre ressource...' }),
  ],
  onUpdate: ({ editor: ed }) => {
    emit('update:modelValue', ed.getHTML())
  },
})

// Sync external changes
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val || '', { emitUpdate: false })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function addLink() {
  const url = prompt('URL du lien :')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

function triggerImageUpload() {
  imageInput.value?.click()
}

async function uploadImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await $fetch<{ data: { url: string } }>('/api/upload/image?folder=resources', {
      method: 'POST',
      body: formData,
    })
    editor.value?.chain().focus().setImage({ src: response.data.url, alt: file.name }).run()
  } catch (err: any) {
    alert(err?.data?.message || 'Erreur lors de l\'upload.')
  } finally {
    uploading.value = false
    if (imageInput.value) imageInput.value.value = ''
  }
}

function setColor(event: Event) {
  const color = (event.target as HTMLInputElement).value
  currentColor.value = color
  editor.value?.chain().focus().setColor(color).run()
}
</script>

<style scoped>
.rich-editor {
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--neutral-0);
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-sep {
  width: 1px;
  height: 24px;
  background: var(--neutral-200);
  margin: 0 6px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-600);
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  background: transparent;
}

.toolbar-btn:hover {
  background: var(--neutral-200);
  color: var(--neutral-900);
}

.toolbar-btn.active {
  background: var(--green-100);
  color: var(--green-700);
}

.toolbar-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.toolbar-color {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toolbar-color input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 32px;
  height: 32px;
}

.toolbar-color__preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid var(--neutral-200);
}

/* Editor content */
.editor-content-wrapper {
  position: relative;
  min-height: 400px;
}

.editor-content-wrapper.is-uploading {
  pointer-events: none;
  opacity: 0.6;
}

.editor-content :deep(.tiptap) {
  padding: 24px;
  min-height: 400px;
  outline: none;
  font-size: 15px;
  line-height: 1.75;
  color: var(--neutral-800);
}

.editor-content :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--neutral-400);
  pointer-events: none;
  height: 0;
}

/* Rich text styling */
.editor-content :deep(.tiptap h2) { font-size: 1.5em; font-weight: 700; margin: 1em 0 0.5em; color: var(--neutral-900); font-family: var(--font-serif); }
.editor-content :deep(.tiptap h3) { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.4em; color: var(--neutral-800); }
.editor-content :deep(.tiptap h4) { font-size: 1.1em; font-weight: 600; margin: 0.8em 0 0.3em; color: var(--neutral-700); }
.editor-content :deep(.tiptap p) { margin: 0.5em 0; }
.editor-content :deep(.tiptap ul),
.editor-content :deep(.tiptap ol) { padding-left: 1.5em; margin: 0.5em 0; }
.editor-content :deep(.tiptap li) { margin: 0.2em 0; }
.editor-content :deep(.tiptap blockquote) { border-left: 4px solid var(--green-300); padding: 0.5em 1em; margin: 1em 0; background: var(--green-50); border-radius: 0 var(--radius-md) var(--radius-md) 0; font-style: italic; color: var(--neutral-600); }
.editor-content :deep(.tiptap img) { max-width: 100%; height: auto; border-radius: var(--radius-lg); margin: 1em 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.editor-content :deep(.tiptap a),
.editor-content :deep(.tiptap .editor-link) { color: var(--green-600); text-decoration: underline; }
.editor-content :deep(.tiptap hr) { border: none; border-top: 2px solid var(--neutral-100); margin: 1.5em 0; }
.editor-content :deep(.tiptap mark) { background: #fef3c7; padding: 0 2px; border-radius: 2px; }

/* Upload overlay */
.editor-uploading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255,255,255,0.85);
  z-index: 10;
}

.editor-uploading__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--neutral-200);
  border-top-color: var(--green-500);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
