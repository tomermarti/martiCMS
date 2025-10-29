import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile } from '../../../../lib/spaces'

const TERMS_FILE_PATH = path.join(process.cwd(), 'public', 'terms-of-service.html')

export async function GET() {
  try {
    // Read the current terms of service file
    const termsContent = fs.readFileSync(TERMS_FILE_PATH, 'utf8')
    
    return NextResponse.json({
      success: true,
      content: termsContent,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error reading terms of service file:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read terms of service file',
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
    fs.writeFileSync(TERMS_FILE_PATH, content, 'utf8')
    
    // Upload to CDN with cache purging
    const timestamp = Date.now()
    
    // Upload main terms file with cache busting
    const termsUrl = await uploadFile('assets/terms-of-service.html', content, 'text/html', true)
    
    // Also upload a versioned copy for immediate access
    const versionedKey = `assets/terms-of-service-${timestamp}.html`
    await uploadFile(versionedKey, content, 'text/html', true)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'terms-of-service', timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Terms of Service uploaded with cache purging at:', timestamp)
    
    return NextResponse.json({
      success: true,
      message: 'Terms of Service updated successfully with cache purging',
      cdnUrl: termsUrl,
      versionedUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${versionedKey}`,
      timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error) {
    console.error('Error updating terms of service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update terms of service file' 
      },
      { status: 500 }
    )
  }
}
