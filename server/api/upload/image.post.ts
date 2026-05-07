import { uploadFile, validateImageFile } from "~~/server/utils/s3"

export default defineEventHandler(async (event) => {
  // Read multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun fichier envoyé.' })
  }

  const file = formData.find(f => f.name === 'file')
  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Fichier manquant ou invalide.' })
  }

  const contentType = file.type || 'application/octet-stream'

  // Validate
  const error = validateImageFile({
    type: contentType,
    size: file.data.length,
    name: file.filename,
  })
  if (error) {
    throw createError({ statusCode: 400, message: error })
  }

  // Determine folder from query
  const query = getQuery(event)
  const folder = (query.folder as string) || 'resources'

  // Upload to S3/MinIO
  const url = await uploadFile(
    Buffer.from(file.data),
    file.filename,
    contentType,
    folder
  )

  return { data: { url } }
})
