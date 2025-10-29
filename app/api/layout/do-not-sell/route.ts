import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile } from '../../../../lib/spaces'

const DO_NOT_SELL_FILE_PATH = path.join(process.cwd(), 'public', 'do-not-sell.html')

export async function GET() {
  try {
    // Read the current do not sell file
    const doNotSellContent = fs.readFileSync(DO_NOT_SELL_FILE_PATH, 'utf8')
    
    return NextResponse.json({
      success: true,
      content: doNotSellContent,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error reading do not sell file:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read do not sell file',
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
    fs.writeFileSync(DO_NOT_SELL_FILE_PATH, content, 'utf8')
    
    // Upload to CDN with cache purging
    const timestamp = Date.now()
    
    // Upload main do not sell file with cache busting
    const doNotSellUrl = await uploadFile('assets/do-not-sell.html', content, 'text/html', true)
    
    // Also upload a versioned copy for immediate access
    const versionedKey = `assets/do-not-sell-${timestamp}.html`
    await uploadFile(versionedKey, content, 'text/html', true)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'do-not-sell', timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Do Not Sell uploaded with cache purging at:', timestamp)
    
    return NextResponse.json({
      success: true,
      message: 'Do Not Sell page updated successfully with cache purging',
      cdnUrl: doNotSellUrl,
      versionedUrl: `https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${versionedKey}`,
      timestamp,
      lastUpdated: new Date().toISOString(),
      cachePurged: true
    })
  } catch (error) {
    console.error('Error updating do not sell page:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update do not sell file' 
      },
      { status: 500 }
    )
  }
}
