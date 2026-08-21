const fs = require('fs');
const path = require('path');

const emails = [
  {
    name: 'DonationConfirmation.vue',
    props: `amount: string\n  date: string`,
    content: `
    <EText :style="headingStyle">Merci pour votre don ! ❤️</EText>
    <EText :style="textStyle">Votre générosité nous touche profondément. Grâce à vous, nous pouvons continuer à accompagner les jeunes Africains dans leur parcours.</EText>
    <div :style="boxStyle">
      <EText :style="detailStyle"><strong>Montant :</strong> {{ amount }}</EText>
      <EText :style="detailStyle"><strong>Date :</strong> {{ date }}</EText>
    </div>
    <EText :style="textStyle">Un reçu fiscal détaillé vous sera envoyé prochainement si applicable.</EText>
    `
  },
  {
    name: 'MentorRequestConfirmed.vue',
    props: `mentorName: string`,
    content: `
    <EText :style="headingStyle">Félicitations {{ mentorName }} ! 🎉</EText>
    <EText :style="textStyle">Votre candidature pour devenir Mentor sur CAP ALI a été officiellement <strong>validée</strong> par notre équipe !</EText>
    <EText :style="textStyle">Vous pouvez dès à présent vous connecter et indiquer vos disponibilités pour recevoir des demandes de mentorat.</EText>
    <EButton href="https://capali.org/mentorship" :style="buttonStyle">Accéder à mon espace</EButton>
    `
  },
  {
    name: 'MentorRequestRefused.vue',
    props: `mentorName: string`,
    content: `
    <EText :style="headingStyle">Mise à jour concernant votre candidature</EText>
    <EText :style="textStyle">Bonjour {{ mentorName }},</EText>
    <EText :style="textStyle">Après un examen attentif de votre profil, nous ne pouvons malheureusement pas valider votre candidature pour devenir Mentor sur CAP ALI pour le moment.</EText>
    <EText :style="textStyle">Nous vous remercions pour votre intérêt et vous invitons à continuer de participer à notre communauté via le forum ou nos événements.</EText>
    `
  },
  {
    name: 'NewMentorshipRequest.vue',
    props: `studentName: string`,
    content: `
    <EText :style="headingStyle">Nouvelle demande de mentorat ! 🎓</EText>
    <EText :style="textStyle">Excellente nouvelle ! L'étudiant(e) <strong>{{ studentName }}</strong> a consulté votre profil et souhaite que vous soyez son mentor.</EText>
    <EText :style="textStyle">Connectez-vous à votre espace personnel pour lire son message et accepter ou décliner sa demande.</EText>
    <EButton href="https://capali.org/mentorship" :style="buttonStyle">Voir la demande</EButton>
    `
  },
  {
    name: 'MentorshipResponse.vue',
    props: `mentorName: string\n  accepted: boolean`,
    content: `
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
    `
  },
  {
    name: 'OrientationTestResult.vue',
    props: `userName: string\n  profileType: string\n  scoreDetails: string`,
    content: `
    <EText :style="headingStyle">Vos résultats au test d'orientation 🎯</EText>
    <EText :style="textStyle">Bonjour {{ userName }}, voici un récapitulatif de votre profil suite au test :</EText>
    <div :style="boxStyle">
      <EText :style="detailStyle"><strong>Profil Dominant :</strong> {{ profileType }}</EText>
      <EText :style="detailStyle" style="white-space: pre-line"><strong>Détails :</strong><br>{{ scoreDetails }}</EText>
    </div>
    <EButton href="https://capali.org/resources" :style="buttonStyle">Voir les ressources recommandées</EButton>
    `
  },
  {
    name: 'NewEventAlert.vue',
    props: `eventTitle: string\n  link: string`,
    content: `
    <EText :style="headingStyle">Nouvel événement CAP ALI ! 📅</EText>
    <EText :style="textStyle">Nous venons de publier un nouvel événement qui pourrait vous intéresser :</EText>
    <EText :style="headingStyle" style="font-size: 18px;">{{ eventTitle }}</EText>
    <EText :style="textStyle">Les places sont souvent limitées, inscrivez-vous dès maintenant !</EText>
    <EButton :href="link" :style="buttonStyle">Voir l'événement</EButton>
    `
  },
  {
    name: 'NewResourceAlert.vue',
    props: `resourceTitle: string\n  link: string`,
    content: `
    <EText :style="headingStyle">Nouveau contenu disponible ! 📚</EText>
    <EText :style="textStyle">Une nouvelle ressource vient d'être ajoutée sur la plateforme :</EText>
    <EText :style="headingStyle" style="font-size: 18px;">{{ resourceTitle }}</EText>
    <EButton :href="link" :style="buttonStyle">Lire l'article</EButton>
    `
  },
  {
    name: 'ForumReply.vue',
    props: `threadTitle: string\n  replyAuthor: string`,
    content: `
    <EText :style="headingStyle">Nouvelle réponse sur le forum 💬</EText>
    <EText :style="textStyle"><strong>{{ replyAuthor }}</strong> a répondu à votre discussion :</EText>
    <EText :style="textStyle" style="font-style: italic;">"{{ threadTitle }}"</EText>
    <EButton href="https://capali.org/forum" :style="buttonStyle">Voir la réponse</EButton>
    `
  },
  {
    name: 'ForumMention.vue',
    props: `threadTitle: string\n  replyAuthor: string`,
    content: `
    <EText :style="headingStyle">On vous a mentionné ! 🔔</EText>
    <EText :style="textStyle"><strong>{{ replyAuthor }}</strong> vous a mentionné dans la discussion :</EText>
    <EText :style="textStyle" style="font-style: italic;">"{{ threadTitle }}"</EText>
    <EButton href="https://capali.org/forum" :style="buttonStyle">Voir le message</EButton>
    `
  },
  {
    name: 'NewsletterOptIn.vue',
    props: `confirmLink: string`,
    content: `
    <EText :style="headingStyle">Merci de vous être abonné(e) ! 📰</EText>
    <EText :style="textStyle">Vous êtes maintenant inscrit(e) à la newsletter CAP ALI. Vous recevrez nos dernières actualités, ressources et événements directement dans votre boîte mail.</EText>
    <EText :style="textStyle">Vous pouvez visiter notre plateforme en attendant la prochaine édition.</EText>
    <EButton :href="confirmLink" :style="buttonStyle">Visiter CAP ALI</EButton>
    `
  }
];

const template = (content, props) => `<template>
  <BaseEmail>
${content}
  </BaseEmail>
</template>

<script setup lang="ts">
import { EText, EButton } from '@vue-email/components'
import BaseEmail from './BaseEmail.vue'

defineProps<{
  ${props}
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
`;

emails.forEach(email => {
  fs.writeFileSync(path.join(__dirname, 'emails', email.name), template(email.content, email.props));
});

// eslint-disable-next-line no-console
console.log('All templates created.');
