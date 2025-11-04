import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, uploadLayoutFileToBothSpaces } from '@/lib/spaces'

// Default header content with dynamic domain placeholders
const DEFAULT_HEADER = `<header class="site-header">
    <div class="header-container">
        <div class="header-brand">
            <a href="https://www.{{DOMAIN}}" class="brand-link">
                <img src="https://{{DOMAIN}}/assets/martideals_logo.png" alt="{{BRAND_NAME}} Logo" class="brand-logo" />
                {{BRAND_NAME}}
            </a>
        </div>
        <button class="hamburger-menu" onclick="toggleMobileMenu()" aria-label="Toggle navigation">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
        <nav class="header-nav" id="mobile-nav">
            <a href="https://www.{{DOMAIN}}" class="nav-link">Home</a>
            <a href="https://www.{{DOMAIN}}/deals" class="nav-link">Deals</a>
            <a href="https://www.{{DOMAIN}}/about" class="nav-link">About</a>
            <a href="https://www.{{DOMAIN}}/contact" class="nav-link">Contact</a>
        </nav>
    </div>
    <script>
        function toggleMobileMenu() {
            const nav = document.getElementById('mobile-nav');
            const hamburger = document.querySelector('.hamburger-menu');
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    </script>
</header>`

export async function GET() {
  try {
    // For now, return the default header
    // In the future, you could store this in a database
    return NextResponse.json({ 
      content: DEFAULT_HEADER,
      lastUpdated: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch header' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Header content is required' },
        { status: 400 }
      )
    }
    
    // Upload header to both spaces with domain-specific content
    const result = await uploadLayoutFileToBothSpaces('assets/header.html', content)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'header', timestamp: result.timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Header uploaded to both spaces with cache purging:', result)
    
    return NextResponse.json({ 
      message: 'Header updated successfully on both spaces with cache purging',
      results: result.results,
      timestamp: result.timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error: any) {
    console.error('Error updating header:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update header' },
      { status: 500 }
    )
  }
}
