<template>
  <BaseEmail>

    <EText :style="headingStyle">Merci de vous être abonné(e) ! 📰</EText>
    <EText :style="textStyle">Vous êtes maintenant inscrit(e) à la newsletter CAP ALI. Vous recevrez nos dernières actualités, ressources et événements directement dans votre boîte mail.</EText>
    <EText :style="textStyle">Vous pouvez visiter notre plateforme en attendant la prochaine édition.</EText>
    <EButton :href="confirmLink" :style="buttonStyle">Visiter CAP ALI</EButton>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  confirmLink: string
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
