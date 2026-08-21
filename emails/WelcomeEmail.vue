<template>
  <BaseEmail>
    <EText :style="headingStyle">Bienvenue dans la communauté CAP ALI, {{ name }} ! 👋</EText>
    
    <EText :style="textStyle">
      Nous sommes ravis de t'accueillir parmi nous. Notre plateforme a été conçue pour t'accompagner tout au long de ton parcours, que ce soit pour tes études, ton orientation ou ton intégration.
    </EText>

    <EText :style="textStyle">
      Voici quelques actions que tu peux réaliser dès maintenant pour bien démarrer :
    </EText>

    <ul :style="listStyle">
      <li :style="listItemStyle">Passer notre <ELink href="https://capali.io/test-orientation" :style="linkStyle">test d'orientation gratuit</ELink></li>
      <li :style="listItemStyle">Découvrir les <ELink href="https://capali.org/resources" :style="linkStyle">ressources exclusives</ELink></li>
      <li :style="listItemStyle">Faire une demande de <ELink href="https://capali.org/mentorship" :style="linkStyle">mentorat personnalisé</ELink></li>
      <li :style="listItemStyle">Participer aux échanges sur le <ELink href="https://capali.org/forum" :style="linkStyle">forum</ELink></li>
    </ul>

    <EButton href="https://capali.org" :style="buttonStyle">
      Accéder à la plateforme
    </EButton>

    <EText :style="textStyle">
      À très vite !<br>
      <strong>L'équipe CAP ALI</strong>
    </EText>
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton, Link as ELink } from '@vue-email/components'

defineProps<{
  name: string
}>()

const headingStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0f172a',
  marginBottom: '24px',
  lineHeight: '1.3',
}

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#334155',
  marginBottom: '16px',
}

const listStyle = {
  marginBottom: '24px',
  paddingLeft: '20px',
}

const listItemStyle = {
  marginBottom: '12px',
  color: '#334155',
}

const linkStyle = {
  color: '#1B6B3A',
  textDecoration: 'underline',
  fontWeight: '500',
}

const buttonStyle = {
  backgroundColor: '#1B6B3A',
  color: '#ffffff',
  padding: '14px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: '600',
  marginTop: '8px',
  marginBottom: '24px',
}
</script>
