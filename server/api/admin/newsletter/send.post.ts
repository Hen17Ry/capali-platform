import { z } from 'zod'

const bodySchema = z.object({
  subject: z.string().min(1),
  html: z.string().min(1),
  recipientEmails: z.array(z.string().email())
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  // TODO: intégrer un système SMTP complet (Nodemailer ou Resend)
  console.log(`[NEWSLETTER MOCK] Sending email "${body.subject}" to ${body.recipientEmails.length} recipients.`)
  console.log(`[NEWSLETTER HTML CONTENT] : \n${body.html}`)
  
  // Simule le délai d'envoi SMTP
  await new Promise(resolve => setTimeout(resolve, 1500))

  return { success: true, message: `Newsletter envoyée avec succès à ${body.recipientEmails.length} abonné(s).` }
})
