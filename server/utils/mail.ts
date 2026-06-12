import { Resend } from 'resend'

let resend: Resend | null = null

export function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set in environment variables.')
    }
    resend = new Resend(apiKey)
  }
  return resend
}

/**
 * Application email config
 */
const APP_NAME = 'CAP ALI'
const APP_URL = process.env.APP_URL || 'http://localhost:3000'
// Use Resend's test domain in dev; replace with your verified domain in production
const FROM_EMAIL = process.env.FROM_EMAIL || 'CAP ALI <onboarding@resend.dev>'

/**
 * Shared email layout wrapper — elegant, responsive HTML email
 */
function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f8; color: #1e293b; line-height: 1.6; }
    .email-wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .email-card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .email-header { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 32px 40px; text-align: center; }
    .email-header img { width: 56px; height: 56px; border-radius: 50%; margin-bottom: 12px; }
    .email-header h1 { font-family: 'Georgia', serif; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: 0.5px; }
    .email-header h1 strong { color: #d4a843; }
    .email-body { padding: 40px; }
    .email-body h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
    .email-body p { font-size: 15px; color: #475569; margin-bottom: 16px; }
    .email-body .highlight { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .email-body .highlight p { margin: 0; color: #166534; font-weight: 500; }
    .email-body .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .email-body .warning p { margin: 0; color: #991b1b; font-weight: 500; }
    .email-body .info { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .email-body .info p { margin: 0; color: #1e40af; font-weight: 500; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 8px 0; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
    .btn-warm { background: linear-gradient(135deg, #d4a843 0%, #c09234 100%); color: #1b4332 !important; }
    .email-footer { padding: 24px 40px; background: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0; }
    .email-footer p { font-size: 12px; color: #94a3b8; }
    .email-footer a { color: #2d6a4f; text-decoration: none; }
    .divider { border: 0; height: 1px; background: #e2e8f0; margin: 24px 0; }
    @media (max-width: 600px) {
      .email-body, .email-footer, .email-header { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="email-header">
        <img src="${APP_URL}/logo.png" alt="${APP_NAME}" />
        <h1>CAP <strong>ALI</strong></h1>
      </div>
      <div class="email-body">
        ${content}
      </div>
      <div class="email-footer">
        <p>&copy; ${new Date().getFullYear()} ${APP_NAME} — Communauté d'Appui au Parcours des Africains et Leaders Inspirants</p>
        <p style="margin-top: 8px;"><a href="${APP_URL}">Visiter le site</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ─── Email types ───────────────────────────────────────────

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
    console.log(`[mail] ✉️  Sent "${subject}" to ${to}`, result)
    return result
  } catch (err) {
    console.error(`[mail] ❌ Failed to send "${subject}" to ${to}`, err)
    // Don't throw — emails failing should not break the main flow
  }
}

// ─── Public email functions ────────────────────────────────

/**
 * Welcome email — sent to every new user on registration
 */
export async function sendWelcomeEmail(user: { name: string; email: string; status: string }) {
  const loginUrl = `${APP_URL}/auth/login`
  const statusLabels: Record<string, string> = {
    predeparture: 'Étudiant / Pré-départ',
    newcomer: 'Nouvel arrivant',
    installed: 'Installé en France',
    mentor: 'Mentor',
  }
  const statusLabel = statusLabels[user.status] || user.status

  const content = `
    <h2>Bienvenue sur CAP ALI, ${user.name} ! 🎉</h2>
    <p>Nous sommes ravis de vous accueillir dans notre communauté. Votre compte a été créé avec succès.</p>
    
    <div class="highlight">
      <p>📋 Votre profil : <strong>${statusLabel}</strong></p>
    </div>

    <p>CAP ALI est une communauté dédiée à l'accompagnement des jeunes Béninois et Africains francophones dans leur parcours vers et en France.</p>

    <p>Voici ce que vous pouvez faire dès maintenant :</p>
    <ul style="padding-left: 20px; margin-bottom: 16px; color: #475569;">
      <li>Explorer les <strong>ressources</strong> pour votre parcours</li>
      <li>Découvrir les <strong>événements</strong> à venir</li>
      <li>Trouver un <strong>mentor</strong> pour vous accompagner</li>
    </ul>

    <p style="text-align: center; margin-top: 28px;">
      <a href="${loginUrl}" class="btn">Accéder à mon espace →</a>
    </p>
  `

  return sendMail({
    to: user.email,
    subject: `Bienvenue sur ${APP_NAME}, ${user.name} !`,
    html: emailLayout(content),
  })
}

/**
 * Mentor application submitted — sent when a mentor completes registration
 */
export async function sendMentorApplicationEmail(user: { name: string; email: string }) {
  const content = `
    <h2>Merci pour votre candidature, ${user.name} ! 🙌</h2>
    <p>Votre demande pour devenir <strong>mentor</strong> sur CAP ALI a bien été soumise.</p>

    <div class="info">
      <p>⏳ Notre équipe examinera votre profil dans les plus brefs délais. Vous recevrez un email dès qu'une décision aura été prise.</p>
    </div>

    <p>En attendant, votre compte est actif et vous pouvez naviguer sur la plateforme. Cependant, les fonctionnalités de mentorat ne seront disponibles qu'après validation.</p>

    <hr class="divider" />

    <p><strong>Ce que nous évaluons :</strong></p>
    <ul style="padding-left: 20px; margin-bottom: 16px; color: #475569;">
      <li>Votre motivation et votre parcours</li>
      <li>Votre disponibilité et votre domaine d'expertise</li>
      <li>Votre capacité à accompagner les mentorés</li>
    </ul>

    <p style="font-size: 13px; color: #94a3b8;">Le délai moyen de traitement est de 48 à 72 heures.</p>
  `

  return sendMail({
    to: user.email,
    subject: `${APP_NAME} — Votre candidature mentor a été soumise`,
    html: emailLayout(content),
  })
}

/**
 * Mentor validated — sent when admin approves a mentor
 */
export async function sendMentorValidatedEmail(user: { name: string; email: string }) {
  const loginUrl = `${APP_URL}/auth/login`

  const content = `
    <h2>Félicitations ${user.name} ! 🎉</h2>
    <p>Excellente nouvelle ! Votre candidature en tant que <strong>mentor</strong> sur CAP ALI a été <strong style="color: #22c55e;">acceptée</strong>.</p>

    <div class="highlight">
      <p>✅ Vous êtes désormais un mentor officiel de la communauté CAP ALI.</p>
    </div>

    <p>Vous pouvez dès à présent :</p>
    <ul style="padding-left: 20px; margin-bottom: 16px; color: #475569;">
      <li>Recevoir des <strong>demandes de mentorat</strong> de la part des étudiants</li>
      <li>Gérer vos <strong>mentorés</strong> depuis votre espace</li>
      <li>Partager votre <strong>expérience</strong> avec la communauté</li>
    </ul>

    <p style="text-align: center; margin-top: 28px;">
      <a href="${loginUrl}" class="btn">Se connecter →</a>
    </p>

    <hr class="divider" />

    <p style="font-size: 13px; color: #94a3b8;">Merci de vous engager pour accompagner notre communauté. Chaque mentor fait la différence. 💚</p>
  `

  return sendMail({
    to: user.email,
    subject: `${APP_NAME} — Vous êtes validé(e) comme mentor ! 🎉`,
    html: emailLayout(content),
  })
}

/**
 * Mentor refused — sent when admin rejects a mentor application
 */
export async function sendMentorRefusedEmail(user: { name: string; email: string }) {
  const content = `
    <h2>Résultat de votre candidature, ${user.name}</h2>
    <p>Nous avons examiné votre demande pour devenir mentor sur CAP ALI.</p>

    <div class="warning">
      <p>Malheureusement, votre candidature n'a pas été retenue pour le moment.</p>
    </div>

    <p>Cela peut être dû à :</p>
    <ul style="padding-left: 20px; margin-bottom: 16px; color: #475569;">
      <li>Un profil incomplet ou insuffisamment détaillé</li>
      <li>Un nombre de places de mentors actuellement limité</li>
      <li>Un profil ne correspondant pas aux besoins actuels de la communauté</li>
    </ul>

    <p>Votre compte reste actif et vous pouvez continuer à profiter de la plateforme en tant que membre. <strong>Vous pouvez soumettre une nouvelle candidature ultérieurement.</strong></p>

    <hr class="divider" />

    <p style="font-size: 13px; color: #94a3b8;">Si vous avez des questions, n'hésitez pas à nous contacter. Nous vous remercions pour votre intérêt envers notre communauté.</p>
  `

  return sendMail({
    to: user.email,
    subject: `${APP_NAME} — Résultat de votre candidature mentor`,
    html: emailLayout(content),
  })
}

export async function sendMentorshipRequestNotificationEmail(args: {
  mentorName: string
  mentorEmail: string
  menteeName: string
  menteeMessage: string
}) {
  const requestUrl = `${APP_URL}/dashboard/mentorship`

  const content = `
    <h2>Nouvelle demande de mentorat</h2>
    <p>Bonjour ${args.mentorName},</p>

    <p><strong>${args.menteeName}</strong> vient de vous envoyer une demande de mentorat.</p>

    <div class="highlight">
      <p>Message du mentoré :</p>
      <p>${args.menteeMessage}</p>
    </div>

    <p>Vous avez <strong>5 jours</strong> pour accepter ou refuser cette demande.</p>

    <p style="text-align: center; margin-top: 28px;">
      <a href="${requestUrl}" class="btn">Voir la demande →</a>
    </p>

    <p>Merci de votre engagement pour la communauté CAP ALI.</p>
  `

  return sendMail({
    to: args.mentorEmail,
    subject: `${APP_NAME} — Nouvelle demande de mentorat de ${args.menteeName}`,
    html: emailLayout(content),
  })
}

export async function sendMentorshipAcceptedEmail(args: {
  menteeName: string
  menteeEmail: string
  mentorName: string
}) {
  const dashboardUrl = `${APP_URL}/dashboard`

  const content = `
    <h2>Votre demande a été acceptée 🎉</h2>
    <p>Bonjour ${args.menteeName},</p>

    <p>Bonne nouvelle ! <strong>${args.mentorName}</strong> a accepté votre demande de mentorat.</p>

    <div class="info">
      <p>Vous pouvez dès maintenant échanger avec votre mentor et commencer votre accompagnement.</p>
    </div>

    <p style="text-align: center; margin-top: 28px;">
      <a href="${dashboardUrl}" class="btn">Voir mon espace →</a>
    </p>
  `

  return sendMail({
    to: args.menteeEmail,
    subject: `${APP_NAME} — Votre demande de mentorat a été acceptée`,
    html: emailLayout(content),
  })
}

export async function sendMentorshipRefusedEmail(args: {
  menteeName: string
  menteeEmail: string
  mentorName: string
  mentorNote?: string
}) {
  const content = `
    <h2>Demande de mentorat refusée</h2>
    <p>Bonjour ${args.menteeName},</p>

    <p>Votre demande de mentorat a été refusée par <strong>${args.mentorName}</strong>.</p>

    ${args.mentorNote ? `<div class="warning"><p>Message du mentor :</p><p>${args.mentorNote}</p></div>` : ''}

    <p>Vous pouvez envoyer une nouvelle demande à un autre mentor si vous le souhaitez.</p>
  `

  return sendMail({
    to: args.menteeEmail,
    subject: `${APP_NAME} — Votre demande de mentorat n'a pas été retenue`,
    html: emailLayout(content),
  })
}

export async function sendMentorshipExpiredEmail(args: {
  mentorName: string
  mentorEmail: string
  menteeName: string
  menteeEmail: string
}) {
  const contentForMentor = `
    <h2>Une demande de mentorat a expiré</h2>
    <p>Bonjour ${args.mentorName},</p>

    <p>La demande de <strong>${args.menteeName}</strong> est restée en attente au-delà de la période de réponse.</p>

    <div class="warning">
      <p>Cette demande a expiré automatiquement.</p>
    </div>

    <p>Vous pouvez toujours proposer de reprendre contact via la plateforme si vous le souhaitez.</p>
  `

  const contentForMentee = `
    <h2>Votre demande de mentorat a expiré</h2>
    <p>Bonjour ${args.menteeName},</p>

    <p>La demande envoyée à <strong>${args.mentorName}</strong> est arrivée à expiration sans réponse.</p>

    <div class="warning">
      <p>Vous pouvez soumettre une nouvelle demande à un autre mentor ou réessayer plus tard.</p>
    </div>
  `

  await Promise.all([
    sendMail({
      to: args.mentorEmail,
      subject: `${APP_NAME} — Une demande de mentorat a expiré`,
      html: emailLayout(contentForMentor),
    }),
    sendMail({
      to: args.menteeEmail,
      subject: `${APP_NAME} — Votre demande de mentorat a expiré`,
      html: emailLayout(contentForMentee),
    }),
  ])
}
