import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug route to test A/B test creation without static file generation
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Debug: Starting A/B test creation...')
    
    const body = await request.json()
    console.log('🔍 Debug: Request body:', JSON.stringify(body, null, 2))
    
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
      console.log('🔍 Debug: Missing required fields')
      return NextResponse.json(
        { error: 'Name, article ID, and test type are required' },
        { status: 400 }
      )
    }
    
    // Validate variants
    if (!variants || variants.length < 2) {
      console.log('🔍 Debug: Invalid variants')
      return NextResponse.json(
        { error: 'At least 2 variants are required (control + 1 variant)' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Debug: Validation passed, creating test...')
    
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
    
    console.log('🔍 Debug: Test created successfully:', test.id)
    
    // Skip static file generation for debugging
    console.log('🔍 Debug: Skipping static file generation for debugging')
    
    return NextResponse.json({ 
      success: true, 
      test,
      message: 'Test created successfully (debug mode - no static file generated)'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('🔍 Debug: Error creating A/B test:', error)
    console.error('🔍 Debug: Error message:', error.message)
    console.error('🔍 Debug: Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: 'Failed to create A/B test', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}

