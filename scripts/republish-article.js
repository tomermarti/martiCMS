#!/usr/bin/env node

/**
 * Manual script to republish a specific article
 * Usage: node scripts/republish-article.js [article-slug]
 */

import { PrismaClient } from '@prisma/client'
import { generateHTML } from '../lib/template.ts'
import { uploadArticle } from '../lib/spaces.ts'

const prisma = new PrismaClient()

async function republishArticle(articleSlug) {
  try {
    console.log(`🔄 Republishing article: ${articleSlug}`)
    
    // Get the article
    const article = await prisma.article.findFirst({
      where: { slug: articleSlug }
    })

    if (!article) {
      console.error(`❌ Article not found: ${articleSlug}`)
      process.exit(1)
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
    
    console.log(`✅ Successfully republished: ${article.slug}`)
    console.log(`🌐 CDN URL: ${cdnUrl}`)
    console.log(`🧪 A/B testing script is now included in the HTML`)
    
  } catch (error) {
    console.error('❌ Failed to republish article:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get article slug from command line argument
const articleSlug = process.argv[2]

if (!articleSlug) {
  console.error('❌ Please provide an article slug')
  console.log('Usage: node scripts/republish-article.js [article-slug]')
  console.log('Example: node scripts/republish-article.js 24-hour-sale-once-it-s-gone-it-s-gone-1')
  process.exit(1)
}

republishArticle(articleSlug)
