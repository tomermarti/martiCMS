import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateHTML } from '@/lib/template'
import { uploadArticle } from '@/lib/spaces'
import { generateStaticABTestFile } from '@/lib/ab-testing-static-generator'

export async function POST(request: NextRequest) {
  try {
    const { articleSlug } = await request.json()

    if (!articleSlug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      )
    }

    console.log(`🔄 Republishing article: ${articleSlug}`)
    
    // Get the article
    const article = await prisma.article.findFirst({
      where: { slug: articleSlug }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    console.log(`📄 Found article: ${article.title}`)
    
    // Generate new HTML with updated template (includes A/B testing script)
    const html = await generateHTML({
      id: article.id,
      slug: article.slug,
      title: article.title,
      metaTitle: article.metaTitle || undefined,
      metaDescription: article.metaDescription || undefined,
      author: article.author,
      featuredImage: article.featuredImage || undefined,
      content: article.content,
      facebookPixel: article.facebookPixel || undefined,
      customScripts: article.customScripts || undefined,
      keywords: article.keywords || undefined,
      canonicalUrl: article.canonicalUrl || undefined,
      publishedAt: article.publishedAt?.toISOString(),
    })
    
    // Upload to CDN with cache busting
    const cdnUrl = await uploadArticle(article.slug, html, true)
    
    // Generate static AB test file for serverless operation
    const abTestUrl = await generateStaticABTestFile(article.id, article.slug)
    
    console.log(`✅ Successfully republished: ${article.slug}`)
    console.log(`🌐 CDN URL: ${cdnUrl}`)
    if (abTestUrl) {
      console.log(`🧪 AB Test JSON: ${abTestUrl}`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article republished successfully!',
      article: {
        slug: article.slug,
        title: article.title,
        cdnUrl
      }
    })
    
  } catch (error: any) {
    console.error('❌ Failed to republish article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to republish article' },
      { status: 500 }
    )
  }
}


