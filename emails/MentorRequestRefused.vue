<template>
  <BaseEmail>

    <EText :style="headingStyle">Mise à jour concernant votre candidature</EText>
    <EText :style="textStyle">Bonjour {{ mentorName }},</EText>
    <EText :style="textStyle">Après un examen attentif de votre profil, nous ne pouvons malheureusement pas valider votre candidature pour devenir Mentor sur CAP ALI pour le moment.</EText>
    <EText :style="textStyle">Nous vous remercions pour votre intérêt et vous invitons à continuer de participer à notre communauté via le forum ou nos événements.</EText>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  mentorName: string
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

const boxStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
}

const detailStyle = {
  fontSize: '15px',
  color: '#1e293b',
  margin: '0 0 8px 0',
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
