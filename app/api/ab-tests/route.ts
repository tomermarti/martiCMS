import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { regenerateABTestFile } from '@/lib/ab-testing-static'

// GET all A/B tests for an article
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const articleId = searchParams.get('articleId')
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    const tests = await prisma.aBTest.findMany({
      where: { articleId },
      include: {
        variants: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(tests)
  } catch (error: any) {
    console.error('Error fetching A/B tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch A/B tests' },
      { status: 500 }
    )
  }
}

// CREATE new A/B test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      articleId,
      testType,
      distributionMode,
      optimizationGoal,
      minSampleSize,
      confidenceLevel,
      variants,
    } = body
    
    // Validate required fields
    if (!name || !articleId || !testType) {
      return NextResponse.json(
        { error: 'Name, article ID, and test type are required' },
        { status: 400 }
      )
    }
    
    // Validate variants
    if (!variants || variants.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 variants are required (control + 1 variant)' },
        { status: 400 }
      )
    }
    
    // Validate traffic percentages sum to 100
    const totalTraffic = variants.reduce((sum: number, v: any) => sum + v.trafficPercent, 0)
    if (Math.abs(totalTraffic - 100) > 0.01) {
      return NextResponse.json(
        { error: 'Traffic percentages must sum to 100%' },
        { status: 400 }
      )
    }
    
    // Ensure exactly one control variant
    const controlCount = variants.filter((v: any) => v.isControl).length
    if (controlCount !== 1) {
      return NextResponse.json(
        { error: 'Exactly one variant must be marked as control' },
        { status: 400 }
      )
    }
    
    // Create test with variants
    const test = await prisma.aBTest.create({
      data: {
        name,
        description,
        articleId,
        testType,
        distributionMode: distributionMode || 'manual',
        optimizationGoal,
        minSampleSize: minSampleSize || 100,
        confidenceLevel: confidenceLevel || 0.95,
        status: 'draft',
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            description: v.description,
            trafficPercent: v.trafficPercent,
            isControl: v.isControl,
            changes: v.changes || {},
          })),
        },
      },
      include: {
        variants: true,
      },
    })
    
    // Generate static JSON file for this article
    try {
      console.log(`🔄 Attempting to generate static file for article: ${articleId}`)
      await regenerateABTestFile(articleId)
      console.log(`✅ Generated static file for article: ${articleId}`)
    } catch (fileError: any) {
      console.error('❌ Error generating static file:', fileError)
      console.error('File error details:', fileError.message)
      // Don't fail the whole request if file generation fails
    }
    
    return NextResponse.json(test, { status: 201 })
  } catch (error: any) {
    console.error('Error creating A/B test:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to create A/B test', details: error.message },
      { status: 500 }
    )
  }
}

