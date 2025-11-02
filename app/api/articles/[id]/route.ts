import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateHTML } from '@/lib/template'
import { uploadArticle, deleteArticleFolder } from '@/lib/spaces'
import { generateStaticABTestFile } from '@/lib/ab-testing-static-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id },
    })
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(article)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const existing = await prisma.article.findUnique({
      where: { id },
    })
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Update article in database
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        author: data.author,
        featuredImage: data.featuredImage,
        contentType: data.contentType,
        content: data.content,
        facebookPixel: data.facebookPixel,
        customScripts: data.customScripts,
        keywords: data.keywords || [],
        canonicalUrl: data.canonicalUrl,
        published: data.published || false,
        publishedAt: data.published && !existing.published ? new Date() : existing.publishedAt,
      },
    })
    
    // If published (or was already published), generate and upload HTML
    if (data.published || existing.published) {
      console.log(`🔄 Republishing article: ${article.slug} (published: ${data.published}, was published: ${existing.published})`)
      
      const html = await generateHTML({
        ...data,
        id: article.id,
        slug: article.slug,
        publishedAt: article.publishedAt?.toISOString(),
      })
      
      await uploadArticle(article.slug, html, true)
      
      // Also regenerate A/B test file for serverless operation
      await generateStaticABTestFile(article.id, article.slug)
      
      console.log(`✅ Article republished to CDN: ${article.slug}`)
    }
    
    return NextResponse.json(article)
  } catch (error: any) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id },
    })
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Delete from Digital Ocean Spaces
    if (article.published) {
      await deleteArticleFolder(article.slug)
    }
    
    // Delete from database
    await prisma.article.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    )
  }
}

