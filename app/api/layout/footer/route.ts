import { NextRequest, NextResponse } from 'next/server'
import { uploadLayoutFile } from '@/lib/spaces'

// Default footer content with updated structure and www.martideals.com links
const DEFAULT_FOOTER = `<footer class="site-footer">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-section">
                <div class="footer-brand">
                    <img src="https://www.martideals.com/martideals-logo.svg" alt="MartiDeals Logo" class="footer-logo" />
                    <p>Your trusted source for the best deals and content.</p>
                </div>
            </div>
            
            <div class="footer-section">
                <h4>COMPANY</h4>
                <ul class="footer-links">
                    <li><a href="https://www.martideals.com/about">About</a></li>
                    <li><a href="https://www.martideals.com/privacy-policy">Privacy</a></li>
                    <li><a href="https://www.martideals.com/terms-of-service">Terms</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>MORE</h4>
                <ul class="footer-links">
                    <li><a href="https://www.martideals.com/">Categories</a></li>
                    <li><a href="https://www.martideals.com/do-not-sell">Do Not Sell My Personal Information</a></li>
                    <li><a href="https://www.martideals.com/ccpa-privacy-rights">CCPA Notice</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p>&copy; 2025 MartiDeals. All rights reserved.</p>
                <div class="ccpa-notice">
                    <a href="https://www.martideals.com/do-not-sell" class="ccpa-link">
                        🔒 Your Privacy Choices / Do Not Sell My Personal Information
                    </a>
                </div>
            </div>
        </div>
    </div>
</footer>`

export async function GET() {
  try {
    // For now, return the default footer
    // In the future, you could store this in a database
    return NextResponse.json({ 
      content: DEFAULT_FOOTER,
      lastUpdated: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch footer' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Footer content is required' },
        { status: 400 }
      )
    }
    
    // Upload footer to CDN with cache purging
    const result = await uploadLayoutFile('assets/footer.html', content)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'footer', timestamp: result.timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Footer uploaded with cache purging:', result)
    
    return NextResponse.json({ 
      message: 'Footer updated successfully with cache purging',
      url: result.url,
      versionedUrl: result.versionedUrl,
      timestamp: result.timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error: any) {
    console.error('Error updating footer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update footer' },
      { status: 500 }
    )
  }
}
