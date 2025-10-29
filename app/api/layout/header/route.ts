import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/spaces'

// Default header content with www.martideals.com links and hamburger menu
const DEFAULT_HEADER = `<header class="site-header">
    <div class="header-container">
        <div class="header-brand">
            <a href="https://www.martideals.com" class="brand-link">
                <img src="https://www.martideals.com/martideals-logo.svg" alt="MartiDeals Logo" class="brand-logo" />
            </a>
        </div>
        <button class="hamburger-menu" onclick="toggleMobileMenu()" aria-label="Toggle navigation">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
        <nav class="header-nav" id="mobile-nav">
            <a href="https://www.martideals.com" class="nav-link">Home</a>
            <a href="https://www.martideals.com/deals" class="nav-link">Deals</a>
            <a href="https://www.martideals.com/about" class="nav-link">About</a>
            <a href="https://www.martideals.com/contact" class="nav-link">Contact</a>
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
    
    // Upload header to CDN with cache purging
    const timestamp = Date.now()
    const headerUrl = await uploadFile('assets/header.html', content, 'text/html', true)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'header', timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Header uploaded with cache purging at:', timestamp)
    
    return NextResponse.json({ 
      message: 'Header updated successfully with cache purging',
      url: headerUrl,
      timestamp,
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
