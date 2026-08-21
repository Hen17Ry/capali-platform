<template>
  <BaseEmail>

    <EText :style="headingStyle">Nouveau contenu disponible ! 📚</EText>
    <EText :style="textStyle">Une nouvelle ressource vient d'être ajoutée sur la plateforme :</EText>
    <EText :style="headingStyle" style="font-size: 18px;">{{ resourceTitle }}</EText>
    <EButton :href="link" :style="buttonStyle">Lire l'article</EButton>
    
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  resourceTitle: string
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
