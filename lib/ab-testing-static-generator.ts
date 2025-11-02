import { prisma } from './prisma'
import { uploadFile } from './spaces'

// Generate static AB test JSON file for CDN deployment
export async function generateStaticABTestFile(articleId: string, articleSlug: string): Promise<string | null> {
  try {
    console.log(`📊 Generating static AB test file for article: ${articleSlug}`)
    
    // Get active variants for this article
    const variants = await prisma.articleVariant.findMany({
      where: { 
        articleId: articleId,
        isActive: true
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true,
            placeholders: true,
            htmlContent: true
          }
        }
      },
      orderBy: [
        { isControl: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    if (variants.length === 0) {
      console.log(`📝 No active variants found for ${articleSlug}, skipping AB test file generation`)
      return null
    }

    // Create static AB test data structure
    const abTestData = {
      tests: [{
        id: `static_test_${articleId}`,
        name: `AB Test for ${articleSlug}`,
        testType: 'template_based',
        status: 'running',
        variants: variants.map(variant => ({
          id: variant.id,
          name: variant.name,
          isControl: variant.isControl,
          trafficPercent: variant.trafficPercent,
          template: variant.template ? {
            id: variant.template.id,
            name: variant.template.name,
            category: variant.template.category,
            placeholders: variant.template.placeholders,
            htmlContent: variant.template.htmlContent
          } : null,
          data: variant.data || {},
          // For backward compatibility with old AB testing system
          changes: variant.template ? null : variant.data
        }))
      }],
      generatedAt: new Date().toISOString(),
      articleId: articleId,
      articleSlug: articleSlug
    }

    // Convert to JSON
    const jsonContent = JSON.stringify(abTestData, null, 2)
    
    // Upload to CDN
    const fileName = `${articleSlug}/ab-tests.json`
    const cdnUrl = await uploadFile(fileName, jsonContent, 'application/json')
    
    console.log(`✅ Static AB test file generated: ${cdnUrl}`)
    return cdnUrl
    
  } catch (error) {
    console.error(`❌ Failed to generate static AB test file for ${articleSlug}:`, error)
    return null
  }
}

// Clean up AB test file when article is unpublished or has no variants
export async function removeStaticABTestFile(articleSlug: string): Promise<boolean> {
  try {
    // Note: We don't have a delete function in spaces.ts, so we'll just upload an empty file
    // or you could implement a delete function in spaces.ts
    const fileName = `${articleSlug}/ab-tests.json`
    const emptyData = { tests: [], generatedAt: new Date().toISOString() }
    await uploadFile(fileName, JSON.stringify(emptyData), 'application/json')
    
    console.log(`🗑️ Removed AB test file for ${articleSlug}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to remove AB test file for ${articleSlug}:`, error)
    return false
  }
}
