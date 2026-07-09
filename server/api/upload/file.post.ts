import { uploadFile } from "~~/server/utils/s3"

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun fichier envoyé.' })
  }

  const file = formData.find(f => f.name === 'file')
  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Fichier manquant ou invalide.' })
  }

  const contentType = file.type || 'application/octet-stream'

  // Max size 20 MB
  if (file.data.length > 20 * 1024 * 1024) {
    throw createError({ statusCode: 400, message: 'Fichier trop volumineux (max 20Mo).' })
  }

  const query = getQuery(event)
  const folder = (query.folder as string) || 'documents'

  const url = await uploadFile(
    Buffer.from(file.data),
    file.filename,
    contentType,
    folder
  )

  return { data: { url, name: file.filename } }
})
