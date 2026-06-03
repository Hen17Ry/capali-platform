import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'node:crypto'

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000'
    s3Client = new S3Client({
      region: 'us-east-1', // MinIO doesn't care, but SDK requires it
      endpoint,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'capali_minio',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'capali_minio_password',
      },
      forcePathStyle: true, // Required for MinIO
    })
  }
  return s3Client
}

const BUCKET = process.env.MINIO_BUCKET || 'capali'

/**
 * Upload a file buffer to S3/MinIO.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  contentType: string,
  folder: string = 'resources'
): Promise<string> {
  const client = getS3Client()
  const ext = originalName.split('.').pop() || 'bin'
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  }))

  // Build public URL using Nuxt proxy route
  return `/s3/${key}`
}

/**
 * Delete a file from S3/MinIO by its URL.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  const client = getS3Client()
  let key = fileUrl
  if (fileUrl.startsWith('/s3/')) {
    key = fileUrl.slice('/s3/'.length)
  } else {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000'
    const prefix = `${endpoint}/${BUCKET}/`
    if (!fileUrl.startsWith(prefix)) return
    key = fileUrl.slice(prefix.length)
  }
  await client.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }))
}

/**
 * Validate image file type and size.
 * Max 5 MB, only common image formats.
 */
export function validateImageFile(file: { type: string; size: number; name: string }): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return 'Type de fichier non supporté. Formats acceptés : JPEG, PNG, WebP, GIF, SVG.'
  }
  const maxSize = 5 * 1024 * 1024 // 5 MB
  if (file.size > maxSize) {
    return 'Le fichier est trop volumineux. Taille maximale : 5 Mo.'
  }
  return null
}
