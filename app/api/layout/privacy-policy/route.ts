import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile } from '../../../../lib/spaces'

const PRIVACY_FILE_PATH = path.join(process.cwd(), 'public', 'privacy-policy.html')

export async function GET() {
  try {
    // Read the current privacy policy file
    const privacyContent = fs.readFileSync(PRIVACY_FILE_PATH, 'utf8')
    
    return NextResponse.json({
      success: true,
      content: privacyContent,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error reading privacy policy file:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read privacy policy file',
        content: '' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    if (typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content must be a string' },
        { status: 400 }
      )
    }

    // Save to local file
    fs.writeFileSync(PRIVACY_FILE_PATH, content, 'utf8')
    
    // Upload to CDN with cache purging
    const timestamp = Date.now()
    
    // Upload main privacy policy file with cache busting
    const privacyUrl = await uploadFile('assets/privacy-policy.html', content, 'text/html', true)
    
    // Also upload a versioned copy for immediate access
    const versionedKey = `assets/privacy-policy-${timestamp}.html`
    await uploadFile(versionedKey, content, 'text/html', true)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'privacy-policy', timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Privacy Policy uploaded with cache purging at:', timestamp)
    
    return NextResponse.json({
      success: true,
      message: 'Privacy Policy updated successfully with cache purging',
      cdnUrl: privacyUrl,
      versionedUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${versionedKey}`,
      timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error) {
    console.error('Error updating privacy policy:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update privacy policy file' 
      },
      { status: 500 }
    )
  }
}
