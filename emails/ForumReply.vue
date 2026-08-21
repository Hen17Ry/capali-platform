<template>
  <BaseEmail>

    <EText :style="headingStyle">Nouvelle réponse sur le forum 💬</EText>
    <EText :style="textStyle"><strong>{{ replyAuthor }}</strong> a répondu à votre discussion :</EText>
    <EText :style="textStyle" style="font-style: italic;">"{{ threadTitle }}"</EText>
    <EButton href="https://capali.org/forum" :style="buttonStyle">Voir la réponse</EButton>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  threadTitle: string
  replyAuthor: string
}>()

const headingStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#0f172a',
  marginBottom: '20px',
}

const textStyle = {
  fontSize: '16px',
  color: '#334155',
  lineHeight: '1.6',
  marginBottom: '16px',
}



const buttonStyle = {
  backgroundColor: '#1B6B3A',
  color: '#ffffff',
  padding: '12px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: '600',
  marginTop: '8px',
}
</script>
