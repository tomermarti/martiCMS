import { NextRequest, NextResponse } from 'next/server'
import { PureStaticABTesting } from '@/lib/ab-testing-pure-static'

// Pure static A/B testing - just generate JSON files
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { articleSlug, testConfig } = body
    
    if (!articleSlug || !testConfig) {
      return NextResponse.json(
        { error: 'Article slug and test config are required' },
        { status: 400 }
      )
    }
    
    // Generate static file
    const filePath = await PureStaticABTesting.generateStaticTestFile(articleSlug, testConfig)
    
    return NextResponse.json({
      success: true,
      message: 'Static A/B test file generated',
      filePath,
      testConfig
    })
    
  } catch (error: any) {
    console.error('Error generating static A/B test file:', error)
    return NextResponse.json(
      { error: 'Failed to generate static file', details: error.message },
      { status: 500 }
    )
  }
}

// Remove static A/B test file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const articleSlug = searchParams.get('articleSlug')
    
    if (!articleSlug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      )
    }
    
    await PureStaticABTesting.removeStaticTestFile(articleSlug)
    
    return NextResponse.json({
      success: true,
      message: 'Static A/B test file removed'
    })
    
  } catch (error: any) {
    console.error('Error removing static A/B test file:', error)
    return NextResponse.json(
      { error: 'Failed to remove static file', details: error.message },
      { status: 500 }
    )
  }
}

