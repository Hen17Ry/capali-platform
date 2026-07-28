// server/utils/mail.ts

import { Resend } from 'resend'
import { 
  getEmailLayout, 
  welcomeTemplate, 
  mentorApplicationTemplate, 
  mentorValidatedTemplate, 
  mentorRefusedTemplate 
} from '../templates/email'

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set in environment variables.')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

// Utilisation directe de votre domaine vérifié capali.org
const FROM_EMAIL = process.env.FROM_EMAIL || 'CAP ALI <no-reply@capali.org>'
const APP_NAME = 'CAP ALI'

interface SendMailOptions {
  to: string
  subject: string
  html: string
}

async function sendMail({ to, subject, html }: SendMailOptions) {
  const resendClient = getResend()
  try {
    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    console.log(`[mail] ✉️ E-mail envoyé avec succès ("${subject}") à ${to}`)
    return result
  } catch (err) {
    // Correction de l'empty-catch : on log l'erreur proprement pour le débuggage
    console.error(`[mail] ❌ Échec de l'envoi de l'e-mail ("${subject}") à ${to}:`, err)
  }
}

/**
 * Envoi de l'e-mail de bienvenue
 */
export async function sendWelcomeEmail(user: { name: string; email: string; status: string }) {
  const statusLabels: Record<string, string> = {
    predeparture: 'Étudiant / Pré-départ',
    newcomer: 'Nouvel arrivant',
    installed: 'Installé en France',
    mentor: 'Mentor',
  }
  const label = statusLabels[user.status] || user.status
  
  const htmlContent = welcomeTemplate(user.name, label)
  
  return sendMail({
    to: user.email,
    subject: `Bienvenue sur ${APP_NAME}, ${user.name} !`,
    html: getEmailLayout(htmlContent),
  })
}

/**
 * Envoi de la confirmation de candidature mentor
 */
export async function sendMentorApplicationEmail(user: { name: string; email: string }) {
  const htmlContent = mentorApplicationTemplate(user.name)
  
  return sendMail({
    to: user.email,
    subject: `${APP_NAME} — Votre candidature mentor a été soumise`,
    html: getEmailLayout(htmlContent),
  })
}

/**
 * Envoi de la validation du mentor
 */
export async function sendMentorValidatedEmail(user: { name: string; email: string }) {
  const htmlContent = mentorValidatedTemplate(user.name)
  
  return sendMail({
    to: user.email,
    subject: `${APP_NAME} — Vous êtes validé(e) comme mentor ! 🎉`,
    html: getEmailLayout(htmlContent),
  })
}

/**
 * Envoi du refus de la candidature mentor
 */
export async function sendMentorRefusedEmail(user: { name: string; email: string }) {
  const htmlContent = mentorRefusedTemplate(user.name)
  
  return sendMail({
    to: user.email,
    subject: `${APP_NAME} — Résultat de votre candidature mentor`,
    html: getEmailLayout(htmlContent),
  })
}