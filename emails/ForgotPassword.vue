<template>
  <BaseEmail title="Réinitialisation de mot de passe">
    <h1 style="color: #1a523a; font-size: 24px; margin-bottom: 24px; text-align: center;">Réinitialisation de mot de passe</h1>
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
      Bonjour <strong>{{ userName }}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
      Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte CAP ALI. 
      Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pendant 1 heure.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a :href="resetUrl" style="background-color: #25a244; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    
    <p style="font-size: 14px; color: #718096; line-height: 1.5; margin-bottom: 24px;">
      Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe restera inchangé.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    
    <p style="font-size: 12px; color: #a0aec0; text-align: center;">
      Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
      <a :href="resetUrl" style="color: #25a244; word-break: break-all;">{{ resetUrl }}</a>
    </p>
  </BaseEmail>
</template>

<script setup lang="ts">
defineProps<{
  userName: string
  resetUrl: string
}>()
</script>
