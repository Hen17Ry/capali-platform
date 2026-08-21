<template>
  <BaseEmail>
    <EText :style="headingStyle">Alerte Administrateur 🚨</EText>
    
    <EText :style="textStyle">
      <strong>Sujet :</strong> {{ title }}
    </EText>

    <div :style="boxStyle">
      <EText :style="messageStyle">{{ message }}</EText>
    </div>

    <EButton href="https://capali.org/admin" :style="buttonStyle">
      Accéder au Dashboard
    </EButton>
  </BaseEmail>
</template>

<script setup lang="ts">
import { Text as EText, Button as EButton } from '@vue-email/components'

defineProps<{
  title: string
  message: string
}>()

const headingStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#b91c1c', // red-700
  marginBottom: '20px',
}

const textStyle = {
  fontSize: '16px',
  color: '#334155',
  marginBottom: '16px',
}

const boxStyle = {
  backgroundColor: '#fef2f2', // red-50
  border: '1px solid #fecaca', // red-200
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
}

const messageStyle = {
  fontSize: '15px',
  color: '#991b1b', // red-800
  margin: '0',
}

const buttonStyle = {
  backgroundColor: '#1f2937', // gray-800
  color: '#ffffff',
  padding: '12px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: '600',
}
</script>
