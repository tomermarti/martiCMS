import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile } from '../../../../lib/spaces'

const CCPA_FILE_PATH = path.join(process.cwd(), 'public', 'ccpa-privacy-rights.html')

export async function GET() {
  try {
    // Read the current CCPA privacy rights file
    const ccpaContent = fs.readFileSync(CCPA_FILE_PATH, 'utf8')
    
    return NextResponse.json({
      success: true,
      content: ccpaContent,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error reading CCPA privacy rights file:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read CCPA privacy rights file',
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
    fs.writeFileSync(CCPA_FILE_PATH, content, 'utf8')
    
    // Upload to CDN with cache purging
    const timestamp = Date.now()
    
    // Upload main CCPA file with cache busting
    const ccpaUrl = await uploadFile('assets/ccpa-privacy-rights.html', content, 'text/html', true)
    
    // Also upload a versioned copy for immediate access
    const versionedKey = `assets/ccpa-privacy-rights-${timestamp}.html`
    await uploadFile(versionedKey, content, 'text/html', true)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ccpa-privacy-rights', timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 CCPA Privacy Rights uploaded with cache purging at:', timestamp)
    
    return NextResponse.json({
      success: true,
      message: 'CCPA Privacy Rights updated successfully with cache purging',
      cdnUrl: ccpaUrl,
      versionedUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${versionedKey}`,
      timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error) {
    console.error('Error updating CCPA privacy rights:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update CCPA privacy rights file' 
      },
      { status: 500 }
    )
  }
}
