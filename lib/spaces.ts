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

export async function uploadFile(key: string, body: string | Buffer, contentType: string, forceCacheBust = false) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: 'public-read',
    CacheControl: forceCacheBust || key.startsWith('layout/') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
  })

  await s3Client.send(command)
  return `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${key}`
}

// New function specifically for layout files with cache purging
export async function uploadLayoutFile(key: string, body: string) {
  // Upload with aggressive cache busting
  const url = await uploadFile(key, body, 'text/html', true)
  
  // Also upload a versioned copy for immediate access
  const timestamp = Date.now()
  const versionedKey = key.replace('.html', `-${timestamp}.html`)
  await uploadFile(versionedKey, body, 'text/html', true)
  
  console.log(`✅ Layout file uploaded: ${key} (versioned: ${versionedKey})`)
  return { url, versionedUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${versionedKey}`, timestamp }
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

