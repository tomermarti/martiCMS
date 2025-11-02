import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Test database connection and A/B test models
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test if we can query articles
    const articleCount = await prisma.article.count()
    console.log(`✅ Found ${articleCount} articles`)
    
    // Test if we can query A/B tests
    const testCount = await prisma.aBTest.count()
    console.log(`✅ Found ${testCount} A/B tests`)
    
    // Test if we can query variants
    const variantCount = await prisma.aBVariant.count()
    console.log(`✅ Found ${variantCount} variants`)
    
    // Get a sample article if any exist
    const sampleArticle = await prisma.article.findFirst({
      select: { id: true, title: true, slug: true }
    })
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      counts: {
        articles: articleCount,
        tests: testCount,
        variants: variantCount
      },
      sampleArticle: sampleArticle || 'No articles found'
    })
    
  } catch (error: any) {
    console.error('🔍 Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

