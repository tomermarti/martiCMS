import { NextRequest, NextResponse } from 'next/server'

// In-memory version tracking (in production, use Redis or database)
let layoutVersions = {
  header: Date.now(),
  footer: Date.now(),
  css: Date.now()
}

export async function GET() {
  try {
    return NextResponse.json({
      versions: layoutVersions,
      headerUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/assets/header.html?v=${layoutVersions.header}`,
      footerUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/assets/footer.html?v=${layoutVersions.footer}`,
      cssUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/assets/styles.css?v=${layoutVersions.css}`
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get versions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, timestamp } = await request.json()
    
    if (type === 'header' || type === 'footer' || type === 'css') {
      layoutVersions[type as keyof typeof layoutVersions] = timestamp || Date.now()
      console.log(`📝 Updated ${type} version to:`, layoutVersions[type as keyof typeof layoutVersions])
    }
    
    return NextResponse.json({
      message: `${type} version updated`,
      versions: layoutVersions
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update version' },
      { status: 500 }
    )
  }
}
