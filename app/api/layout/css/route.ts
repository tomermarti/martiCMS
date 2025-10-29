import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile } from '../../../../lib/spaces'

const CSS_FILE_PATH = path.join(process.cwd(), 'public', 'styles.css')

export async function GET() {
  try {
    // Read the current CSS file
    const cssContent = fs.readFileSync(CSS_FILE_PATH, 'utf8')
    
    return NextResponse.json({
      success: true,
      content: cssContent
    })
  } catch (error) {
    console.error('Error reading CSS file:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read CSS file',
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
    fs.writeFileSync(CSS_FILE_PATH, content, 'utf8')
    
    // Upload to CDN with aggressive cache purging (similar to layout files)
    const timestamp = Date.now()
    
    // Upload main CSS file with cache busting
    const cssUrl = await uploadFile('assets/styles.css', content, 'text/css', true)
    
    // Also upload a versioned copy for immediate access
    const versionedKey = `assets/styles-${timestamp}.css`
    await uploadFile(versionedKey, content, 'text/css', true)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'css', timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 CSS uploaded with cache purging at:', timestamp)
    
    return NextResponse.json({
      success: true,
      message: 'CSS updated successfully with cache purging',
      cdnUrl: cssUrl,
      versionedUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${versionedKey}`,
      timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error) {
    console.error('Error updating CSS:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update CSS file' 
      },
      { status: 500 }
    )
  }
}
