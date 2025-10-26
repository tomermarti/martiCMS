import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
})

const BUCKET = process.env.DO_SPACES_BUCKET!

export async function uploadFile(key: string, body: string | Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: 'public-read',
  })

  await s3Client.send(command)
  return `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${key}`
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  })

  await s3Client.send(command)
}

export async function listFiles(prefix: string) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  })

  const response = await s3Client.send(command)
  return response.Contents || []
}

export async function uploadArticle(slug: string, htmlContent: string) {
  const key = `${slug}/index.html`
  return uploadFile(key, htmlContent, 'text/html; charset=utf-8')
}

export async function uploadArticleImage(slug: string, imageName: string, imageBuffer: Buffer, contentType: string) {
  const key = `${slug}/images/${imageName}`
  return uploadFile(key, imageBuffer, contentType)
}

export async function deleteArticleFolder(slug: string) {
  // List all files in the article folder
  const files = await listFiles(`${slug}/`)
  
  // Delete each file
  for (const file of files) {
    if (file.Key) {
      await deleteFile(file.Key)
    }
  }
}

