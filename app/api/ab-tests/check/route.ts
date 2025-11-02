import { NextRequest, NextResponse } from 'next/server'

// Add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleSlug = searchParams.get('slug')
    
    if (!articleSlug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      )
    }

    // Fetch from CDN server-side (no CORS issues)
    const cdnDomain = process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'
    const cdnUrl = `https://${cdnDomain}/${articleSlug}/ab-tests.json?v=${Date.now()}`
    
    console.log('🔍 Server-side check for A/B test:', cdnUrl)
    
    const response = await fetch(cdnUrl)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Found A/B test data on CDN')
      return NextResponse.json(data, {
        headers: corsHeaders()
      })
    } else {
      console.log('📝 No A/B test found on CDN')
      return NextResponse.json(
        { tests: [] },
        { 
          status: 200,
          headers: corsHeaders()
        }
      )
    }
  } catch (error: any) {
    console.log('📝 Error checking A/B test:', error.message)
    return NextResponse.json(
      { tests: [] },
      { 
        status: 200,
        headers: corsHeaders()
      }
    )
  }
}
