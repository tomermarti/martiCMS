import { NextRequest, NextResponse } from 'next/server'
import { uploadLayoutFile, uploadLayoutFileToBothSpaces } from '@/lib/spaces'

// Default footer content with dynamic domain placeholders
const DEFAULT_FOOTER = `<footer class="site-footer">
    <div class="footer-container">
        <!-- Editorial Note -->
        <div class="editorial-note">
            <p><strong>Editorial Note:</strong> We independently review all products. If you make a purchase through our links, we may receive a commission.</p>
        </div>
        
        <!-- Opt-in Disclaimer -->
        <div class="opt-in-disclaimer">
            <p>By continuing to use this site, you consent to our use of cookies and sharing of technical data with partners for analytics and service improvements.</p>
        </div>
        
        <div class="footer-simple">
            <a href="https://{{DOMAIN}}/assets/privacy-policy.html">Privacy Policy</a>
            <a href="https://{{DOMAIN}}/assets/terms-of-service.html">Terms & Conditions</a>
            <a href="https://{{DOMAIN}}/assets/do-not-sell.html" class="ccpa-important">🔒 Do Not Sell My Personal Information</a>
            <a href="https://{{DOMAIN}}/assets/ccpa-privacy-rights.html">CCPA Notice</a>
        </div>
        
        <!-- Copyright -->
        <div class="footer-copyright">
            <p>{{BRAND_NAME}}.com © 2025 All Rights Reserved</p>
        </div>
    </div>
</footer>

<!-- Cookie Consent Banner - Glass View Design -->
<div id="cookie-banner" class="cookie-banner" style="display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 999999;">
    <div class="cookie-banner-content">
        <div class="cookie-info">
            <p>
                We use cookies to enhance your experience. 
                <a href="https://{{DOMAIN}}/assets/ccpa-privacy-rights.html" class="privacy-link">Learn more</a>
            </p>
        </div>
        <div class="cookie-actions">
            <button type="button" onclick="rejectCookies(event)" class="btn-reject">Reject</button>
            <button type="button" onclick="acceptCookies(event)" class="btn-accept">ACCEPT</button>
        </div>
    </div>
</div>`

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
    
    // Upload footer to both spaces with domain-specific content
    const result = await uploadLayoutFileToBothSpaces('assets/footer.html', content)
    
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
    
    console.log('🔄 Footer uploaded to both spaces with cache purging:', result)
    
    return NextResponse.json({ 
      message: 'Footer updated successfully on both spaces with cache purging',
      results: result.results,
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
