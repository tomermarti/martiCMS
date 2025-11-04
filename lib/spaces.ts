import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

// Space configurations
const SPACES_CONFIG = {
  daily: {
    bucket: 'deals',
    domain: 'daily.get.martideals.com',
    brandName: 'MartiDeals'
  },
  heymarti: {
    bucket: 'heymarti',
    domain: 'files.cdn.heymarti.com',
    brandName: 'HeyMarti'
  }
}

// Create S3 clients for each space
const createS3Client = () => {
  // Check for required environment variables
  if (!process.env.DO_SPACES_ENDPOINT) {
    throw new Error('DO_SPACES_ENDPOINT environment variable is required')
  }
  if (!process.env.DO_SPACES_KEY) {
    throw new Error('DO_SPACES_KEY environment variable is required')
  }
  if (!process.env.DO_SPACES_SECRET) {
    throw new Error('DO_SPACES_SECRET environment variable is required')
  }

  return new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION || 'nyc3',
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    },
  })
}

const s3Client = createS3Client()
const BUCKET = process.env.DO_SPACES_BUCKET || 'deals'

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

// Function to replace domain placeholders in HTML content
function replaceDomainPlaceholders(content: string, spaceName: 'daily' | 'heymarti'): string {
  const config = SPACES_CONFIG[spaceName]
  return content
    .replace(/\{\{DOMAIN\}\}/g, config.domain)
    .replace(/\{\{BRAND_NAME\}\}/g, config.brandName)
    .replace(/https:\/\/daily\.get\.martideals\.com/g, `https://${config.domain}`)
    .replace(/https:\/\/files\.cdn\.heymarti\.com/g, `https://${config.domain}`)
    .replace(/MartiDeals/g, config.brandName)
    .replace(/HeyMarti/g, config.brandName)
}

// Upload file to a specific space
export async function uploadFileToSpace(spaceName: 'daily' | 'heymarti', key: string, body: string | Buffer, contentType: string, forceCacheBust = false) {
  try {
    console.log(`🔄 uploadFileToSpace: ${spaceName}, key: ${key}, contentType: ${contentType}`)
    
    const config = SPACES_CONFIG[spaceName]
    console.log(`🔄 Using bucket: ${config.bucket} for space: ${spaceName}`)
    
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: forceCacheBust || key.startsWith('layout/') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
    })

    console.log(`🔄 Sending command to S3 for ${spaceName}...`)
    await s3Client.send(command)
    
    const url = `https://${config.domain}/${key}`
    console.log(`✅ Upload successful for ${spaceName}: ${url}`)
    return url
  } catch (error) {
    console.error(`❌ Error uploading to ${spaceName}:`, error)
    throw error
  }
}

// Upload layout file to both spaces with domain-specific content
export async function uploadLayoutFileToBothSpaces(key: string, templateContent: string) {
  console.log('🔄 Starting upload to both spaces for key:', key)
  
  const timestamp = Date.now()
  const results = []
  const errors = []

  for (const spaceName of ['daily', 'heymarti'] as const) {
    try {
      console.log(`🔄 Processing space: ${spaceName}`)
      
      // Replace domain placeholders with space-specific values
      const spaceContent = replaceDomainPlaceholders(templateContent, spaceName)
      console.log(`🔄 Content processed for ${spaceName}, length: ${spaceContent.length}`)
      
      // Upload main file with aggressive cache busting
      console.log(`🔄 Uploading main file to ${spaceName}...`)
      const url = await uploadFileToSpace(spaceName, key, spaceContent, 'text/html', true)
      
      // Also upload a versioned copy for immediate access
      const versionedKey = key.replace('.html', `-${timestamp}.html`)
      console.log(`🔄 Uploading versioned file to ${spaceName}: ${versionedKey}`)
      const versionedUrl = await uploadFileToSpace(spaceName, versionedKey, spaceContent, 'text/html', true)
      
      results.push({
        space: spaceName,
        url,
        versionedUrl,
        domain: SPACES_CONFIG[spaceName].domain
      })
      
      console.log(`✅ Layout file uploaded to ${spaceName}: ${key} (versioned: ${versionedKey})`)
    } catch (error) {
      console.error(`❌ Error uploading to ${spaceName}:`, error)
      errors.push({ space: spaceName, error: error.message })
      
      // Continue with other spaces even if one fails
      results.push({
        space: spaceName,
        url: null,
        versionedUrl: null,
        domain: SPACES_CONFIG[spaceName].domain,
        error: error.message
      })
    }
  }
  
  console.log('✅ Upload process completed')
  console.log(`✅ Successful uploads: ${results.filter(r => !r.error).length}`)
  console.log(`❌ Failed uploads: ${errors.length}`)
  
  // If all uploads failed, throw an error
  if (errors.length === 2) {
    throw new Error(`All uploads failed: ${errors.map(e => `${e.space}: ${e.error}`).join(', ')}`)
  }
  
  return { results, timestamp, errors }
}

// New function specifically for layout files with cache purging (backward compatibility)
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

export async function uploadArticle(slug: string, htmlContent: string, forceCacheBust = false) {
  const key = `${slug}/index.html`
  return uploadFile(key, htmlContent, 'text/html; charset=utf-8', forceCacheBust)
}

export async function uploadABTestJSON(slug: string, jsonContent: string) {
  const key = `${slug}/ab-tests.json`
  return uploadFile(key, jsonContent, 'application/json', true) // Always cache-bust for fresh data
}

export async function deleteABTestJSON(slug: string) {
  const key = `${slug}/ab-tests.json`
  try {
    await deleteFile(key)
    console.log(`✅ Deleted A/B test JSON: ${key}`)
  } catch (error) {
    // File might not exist, that's okay
    console.log(`📝 No A/B test JSON to delete: ${key}`)
  }
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

