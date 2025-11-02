import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateHTML } from '@/lib/template'
import { uploadArticle } from '@/lib/spaces'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    
    // Ensure slug is unique
    let uniqueSlug = data.slug
    let counter = 1
    
    while (true) {
      const existingArticle = await prisma.article.findUnique({
        where: { slug: uniqueSlug }
      })
      
      if (!existingArticle) {
        break
      }
      
      uniqueSlug = `${data.slug}-${counter}`
      counter++
    }
    
    // Create article in database
    const article = await prisma.article.create({
      data: {
        slug: uniqueSlug,
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
        publishedAt: data.published ? new Date() : null,
      },
    })
    
    // If published, generate and upload HTML
    if (data.published) {
      const html = await generateHTML({
        ...data,
        slug: article.slug,
        publishedAt: article.publishedAt?.toISOString(),
      })
      
      await uploadArticle(article.slug, html, true)
    }
    
    return NextResponse.json(article)
  } catch (error: any) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Check if slug exists
      const articles = await prisma.article.findMany({
        where: { slug },
        select: { id: true, slug: true }
      })
      return NextResponse.json(articles)
    }
    
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(articles)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

