import { Resend } from 'resend'
import { config as vueEmailConfig } from '@vue-email/compiler'
import { resolve } from 'path'

const vueEmail = vueEmailConfig(resolve(process.cwd(), 'emails'), { verbose: false })

let resend: Resend | null = null

function getResendClient() {
  if (!resend) {
    const config = useRuntimeConfig()
    if (!config.resendApiKey) {
      console.warn('RESEND_API_KEY is not defined. Emails will not be sent.')
      return null
    }
    resend = new Resend(config.resendApiKey)
  }
  return resend
}

// Les différentes adresses d'expédition par catégorie
export const EMAIL_SENDERS = {
  NO_REPLY: 'CAP ALI <no-reply@capali.org>',
  HELLO: 'CAP ALI <hello@capali.org>',
  MENTORSHIP: 'CAP ALI Mentorat <mentorship@capali.org>',
  EVENTS: 'CAP ALI Événements <events@capali.org>',
  DONATIONS: 'CAP ALI Dons <donations@capali.org>',
  ADMIN: 'CAP ALI Admin <admin@capali.org>',
}

type SendEmailOptions = {
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string; // Optionnel : par défaut on utilisera NO_REPLY
}

export const emailService = {
  /**
   * Fonction de base pour envoyer un email
   */
  async sendEmail(options: SendEmailOptions) {
    const client = getResendClient()
    if (!client) return { error: 'Resend API key missing' }

    try {
      const data = await client.emails.send({
        // Si aucune adresse "from" n'est spécifiée, on utilise le no-reply
        from: options.from || EMAIL_SENDERS.NO_REPLY,
        to: Array.isArray(options.to) ? options.to : [options.to],
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
      return { data }
    } catch (error) {
      console.error('[EmailService] Error sending email:', error)
      return { error }
    }
  },

  // ==========================================
  // 1. AUTHENTIFICATION & COMPTE
  // ==========================================
  
  async sendWelcomeEmail(to: string, userName: string) {
    const template = await vueEmail.render('WelcomeEmail.vue', { props: { name: userName } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.NO_REPLY,
      subject: 'Bienvenue sur CAP ALI ! 🎉',
      html: template.html,
      text: template.text,
    })
  },

  async sendEmailVerification(to: string, verificationLink: string) {
    // A créer dans un second temps ou réutiliser
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.NO_REPLY,
      subject: 'Vérifiez votre adresse email',
      html: `<h2>Vérification</h2><p>Cliquez ici pour vérifier votre email : <a href="${verificationLink}">Vérifier mon email</a></p>`
    })
  },

  async sendPasswordReset(to: string, userName: string, resetLink: string) {
    const template = await vueEmail.render('ForgotPassword.vue', { props: { userName, resetUrl: resetLink } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.NO_REPLY,
      subject: 'Réinitialisation de votre mot de passe',
      html: template.html,
      text: template.text,
    })
  },

  async sendSecurityAlert(to: string, actionDetails: string) {
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.NO_REPLY,
      subject: 'Alerte de sécurité sur votre compte',
      html: `<h2>Alerte de sécurité</h2><p>Une action sensible a été détectée sur votre compte : ${actionDetails}</p>`
    })
  },

  // ==========================================
  // 2. MENTORAT
  // ==========================================

  async sendNewMentorshipRequest(mentorEmail: string, studentName: string) {
    const template = await vueEmail.render('NewMentorshipRequest.vue', { props: { studentName } })
    return this.sendEmail({
      to: mentorEmail,
      from: EMAIL_SENDERS.MENTORSHIP,
      subject: 'Nouvelle demande de mentorat !',
      html: template.html,
      text: template.text,
    })
  },

  async sendMentorshipResponse(studentEmail: string, mentorName: string, accepted: boolean) {
    const template = await vueEmail.render('MentorshipResponse.vue', { props: { mentorName, accepted } })
    return this.sendEmail({
      to: studentEmail,
      from: EMAIL_SENDERS.MENTORSHIP,
      subject: accepted ? 'Demande de mentorat acceptée 🎉' : 'Mise à jour de votre demande de mentorat',
      html: template.html,
      text: template.text,
    })
  },

  async sendMentorRequestConfirmedEmail(to: string, mentorName: string) {
    const template = await vueEmail.render('MentorRequestConfirmed.vue', { props: { mentorName } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.MENTORSHIP,
      subject: 'Votre candidature Mentor a été acceptée ! 🎉',
      html: template.html,
      text: template.text,
    })
  },

  async sendMentorRequestRefusedEmail(to: string, mentorName: string) {
    const template = await vueEmail.render('MentorRequestRefused.vue', { props: { mentorName } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.MENTORSHIP,
      subject: 'Mise à jour concernant votre candidature Mentor',
      html: template.html,
      text: template.text,
    })
  },

  async sendOrientationTestResultEmail(to: string, userName: string, profileType: string, scoreDetails: string) {
    const template = await vueEmail.render('OrientationTestResult.vue', { props: { userName, profileType, scoreDetails } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.MENTORSHIP,
      subject: 'Vos résultats au test d\'orientation CAP ALI',
      html: template.html,
      text: template.text,
    })
  },

  // ==========================================
  // 3. DONS
  // ==========================================

  async sendDonationConfirmation(to: string, amount: string, date: string) {
    const template = await vueEmail.render('DonationConfirmation.vue', { props: { amount, date } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.DONATIONS,
      subject: 'Merci pour votre don ! ❤️',
      html: template.html,
      text: template.text,
    })
  },

  async sendDonationFailure(to: string) {
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.DONATIONS,
      subject: 'Problème avec votre paiement de don',
      html: `<h2>Oops</h2><p>Le prélèvement pour votre don n'a pas pu aboutir. Veuillez vérifier vos informations de paiement.</p>`
    })
  },

  // ==========================================
  // 4. ÉVÉNEMENTS
  // ==========================================

  async sendEventRegistrationConfirmation(to: string, eventName: string, date: string, linkOrPlace: string, isPaid: boolean, amountEur: number = 0, transactionId: string = '') {
    let receiptHtml = ''
    if (isPaid) {
      receiptHtml = `
        <div style="margin-top: 20px; padding: 20px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #1B6B3A;">Quittance de Paiement</h3>
          <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr><th style="padding: 4px 0;">Montant réglé :</th><td>${amountEur} €</td></tr>
            <tr><th style="padding: 4px 0;">Référence de transaction :</th><td>${transactionId}</td></tr>
            <tr><th style="padding: 4px 0;">Date :</th><td>${new Date().toLocaleDateString('fr-FR')}</td></tr>
          </table>
          <p style="font-size: 12px; color: #666; margin-top: 15px;">Ceci constitue un reçu officiel émis par CAP ALI.</p>
        </div>
      `
    }

    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.EVENTS,
      subject: `Billet & Confirmation : ${eventName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B6B3A;">Votre inscription est confirmée ! 🎉</h2>
          <p>Merci pour votre inscription. Vous êtes officiellement sur la liste des participants pour <strong>${eventName}</strong>.</p>
          <div style="background: #eef7f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Date et Heure :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>📍 Lieu ou Lien :</strong> ${linkOrPlace}</p>
          </div>
          ${receiptHtml}
          <p style="margin-top: 20px;">À très bientôt !<br>L'équipe CAP ALI</p>
        </div>
      `
    })
  },

  async sendEventReminder(to: string, eventName: string, startsIn: string) {
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.EVENTS,
      subject: `Rappel : ${eventName} commence bientôt !`,
      html: `<h2>Rappel</h2><p>L'événement ${eventName} commence dans ${startsIn}. Ne le manquez pas !</p>`
    })
  },

  async sendNewEventAlert(bcc: string[], eventTitle: string, link: string) {
    const template = await vueEmail.render('NewEventAlert.vue', { props: { eventTitle, link } })
    return this.sendEmail({
      to: EMAIL_SENDERS.EVENTS, // Send to self
      bcc,                      // BCC everyone else to protect privacy
      from: EMAIL_SENDERS.EVENTS,
      subject: `Nouvel événement : ${eventTitle} ! 🎉`,
      html: template.html,
      text: template.text,
    })
  },

  // ==========================================
  // 5. FORUM & INTERACTIONS
  // ==========================================

  async sendForumReply(to: string, threadTitle: string, authorName: string) {
    const template = await vueEmail.render('ForumReply.vue', { props: { threadTitle, replyAuthor: authorName } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.NO_REPLY,
      subject: `Nouvelle réponse dans : ${threadTitle}`,
      html: template.html,
      text: template.text,
    })
  },

  async sendForumMention(to: string, threadTitle: string, authorName: string) {
    const template = await vueEmail.render('ForumMention.vue', { props: { threadTitle, replyAuthor: authorName } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.NO_REPLY,
      subject: `${authorName} vous a mentionné !`,
      html: template.html,
      text: template.text,
    })
  },

  // ==========================================
  // 6. NEWSLETTER & RESSOURCES
  // ==========================================

  async sendNewsletterOptIn(to: string, confirmLink: string) {
    const template = await vueEmail.render('NewsletterOptIn.vue', { props: { confirmLink } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.HELLO,
      subject: 'Merci de vous être abonné(e) à la newsletter',
      html: template.html,
      text: template.text,
    })
  },

  async sendNewResourceAlert(to: string | string[], resourceTitle: string, link: string) {
    const template = await vueEmail.render('NewResourceAlert.vue', { props: { resourceTitle, link } })
    return this.sendEmail({
      to,
      from: EMAIL_SENDERS.HELLO, 
      subject: 'Nouvelle ressource disponible !',
      html: template.html,
      text: template.text,
    })
  },

  // ==========================================
  // 7. NOTIFICATIONS ADMINISTRATEURS
  // ==========================================

  async sendAdminAlert(subject: string, details: string) {
    const template = await vueEmail.render('AdminAlert.vue', { props: { title: subject, message: details } })
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@capali.org'
    return this.sendEmail({
      to: adminEmail,
      from: EMAIL_SENDERS.ADMIN,
      subject: `[Alerte Admin] ${subject}`,
      html: template.html,
      text: template.text,
    })
  }
}
