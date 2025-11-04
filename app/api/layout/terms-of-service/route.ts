import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadFile, uploadLayoutFileToBothSpaces } from '../../../../lib/spaces'

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
    
    // Upload to both spaces with domain-specific content
    const result = await uploadLayoutFileToBothSpaces('assets/terms-of-service.html', content)
    
    // Update version tracker
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'terms-of-service', timestamp: result.timestamp })
      })
    } catch (error) {
      console.warn('Failed to update version tracker:', error)
    }
    
    console.log('🔄 Terms of Service uploaded to both spaces with cache purging:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Terms of Service updated successfully on both spaces with cache purging',
      results: result.results,
      timestamp: result.timestamp,
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
