<template>
  <BaseEmail>

    <EText :style="headingStyle">Mise à jour concernant votre candidature</EText>
    <EText :style="textStyle">Bonjour {{ mentorName }},</EText>
    <EText :style="textStyle">Après un examen attentif de votre profil, nous ne pouvons malheureusement pas valider votre candidature pour devenir Mentor sur CAP ALI pour le moment.</EText>
    <EText :style="textStyle">Nous vous remercions pour votre intérêt et vous invitons à continuer de participer à notre communauté via le forum ou nos événements.</EText>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText } from '@vue-email/components'

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
</script>
