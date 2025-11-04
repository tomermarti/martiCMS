import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile, uploadLayoutFileToBothSpaces } from '../../../../lib/spaces'

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
    
    // Upload to both spaces with domain-specific content
    const result = await uploadLayoutFileToBothSpaces('assets/privacy-policy.html', content)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'privacy-policy', timestamp: result.timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Privacy Policy uploaded to both spaces with cache purging:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Privacy Policy updated successfully on both spaces with cache purging',
      results: result.results,
      timestamp: result.timestamp,
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
