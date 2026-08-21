<template>
  <BaseEmail>

    <EText :style="headingStyle">Nouvelle demande de mentorat ! 🎓</EText>
    <EText :style="textStyle">Excellente nouvelle ! L'étudiant(e) <strong>{{ studentName }}</strong> a consulté votre profil et souhaite que vous soyez son mentor.</EText>
    <EText :style="textStyle">Connectez-vous à votre espace personnel pour lire son message et accepter ou décliner sa demande.</EText>
    <EButton href="https://capali.org/mentorship" :style="buttonStyle">Voir la demande</EButton>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  studentName: string
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
