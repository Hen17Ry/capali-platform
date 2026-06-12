import { db } from '~~/server/db'
import { donations } from '~~/server/db/schema'
import { desc, sql } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  // Check auth
  const session = await getSessionFromEvent(event)
  if (!session || !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Obtenir la liste des dons
  const donationsList = await db.select().from(donations).orderBy(desc(donations.createdAt))

  // Calculer les statistiques
  // Seuls les dons avec statut 'completed' sont comptabilisés pour le total
  const statsResult = await db.select({
    totalAmount: sql<number>`sum(case when status = 'completed' then amount else 0 end)::int`,
    totalDonors: sql<number>`count(distinct email)::int`,
    totalCompletedDonations: sql<number>`sum(case when status = 'completed' then 1 else 0 end)::int`,
  }).from(donations)

  return {
    data: donationsList,
    stats: statsResult[0] || { totalAmount: 0, totalDonors: 0, totalCompletedDonations: 0 }
  }
})
