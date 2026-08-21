<template>
  <BaseEmail>

    <EText :style="headingStyle">{{ accepted ? 'Demande acceptée ! 🎉' : 'Mise à jour de votre demande' }}</EText>
    <EText :style="textStyle">
      <template v-if="accepted">
        Super nouvelle ! <strong>{{ mentorName }}</strong> a accepté votre demande de mentorat. 
        Vous pouvez dès maintenant le/la contacter depuis votre espace pour organiser votre premier échange.
      </template>
      <template v-else>
        Le mentor <strong>{{ mentorName }}</strong> n'a malheureusement pas pu accepter votre demande de mentorat (manque de temps, domaine différent, etc.).
        Ne vous découragez pas, d'autres mentors sont disponibles !
      </template>
    </EText>
    <EButton href="https://capali.org/mentorship" :style="buttonStyle">Aller sur CAP ALI</EButton>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  mentorName: string
  accepted: boolean
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
