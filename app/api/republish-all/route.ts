import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateHTML } from '@/lib/template'
import { uploadArticle } from '@/lib/spaces'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting republish of all articles...')
    
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📄 Found ${articles.length} published articles to republish`)
    
    const results = []
    
    for (const article of articles) {
      try {
        console.log(`🔄 Republishing: ${article.title} (${article.slug})`)
        
        // Generate new HTML with updated template
        const html = generateHTML({
          slug: article.slug,
          title: article.title,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          author: article.author,
          featuredImage: article.featuredImage,
          contentType: article.contentType,
          content: article.content,
          facebookPixel: article.facebookPixel,
          customScripts: article.customScripts,
          keywords: article.keywords,
          canonicalUrl: article.canonicalUrl,
          publishedAt: article.publishedAt?.toISOString(),
        })
        
        // Upload to CDN
        await uploadArticle(article.slug, html)
        
        results.push({
          slug: article.slug,
          title: article.title,
          status: 'success'
        })
        
        console.log(`✅ Successfully republished: ${article.slug}`)
        
      } catch (error: any) {
        console.error(`❌ Failed to republish ${article.slug}:`, error)
        results.push({
          slug: article.slug,
          title: article.title,
          status: 'error',
          error: error.message
        })
      }
    }
    
    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length
    
    console.log(`🎉 Republish complete! Success: ${successCount}, Errors: ${errorCount}`)
    
    return NextResponse.json({
      message: 'Republish completed',
      total: articles.length,
      success: successCount,
      errors: errorCount,
      results
    })
    
  } catch (error: any) {
    console.error('❌ Failed to republish articles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to republish articles' },
      { status: 500 }
    )
  }
}
