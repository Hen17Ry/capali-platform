<template>
  <BaseEmail>

    <EText :style="headingStyle">Nouvel événement CAP ALI ! 📅</EText>
    <EText :style="textStyle">Nous venons de publier un nouvel événement qui pourrait vous intéresser :</EText>
    <EText :style="headingStyle" style="font-size: 18px;">{{ eventTitle }}</EText>
    <EText :style="textStyle">Les places sont souvent limitées, inscrivez-vous dès maintenant !</EText>
    <EButton :href="link" :style="buttonStyle">Voir l'événement</EButton>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  eventTitle: string
  link: string
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
