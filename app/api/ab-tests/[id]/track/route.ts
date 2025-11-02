import { NextRequest, NextResponse } from 'next/server'
import { trackVariantView, trackConversion, trackClick } from '@/lib/ab-testing'

// Track A/B test events
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { eventType, variantId, sessionId, eventData } = body
    
    if (!variantId || !sessionId) {
      return NextResponse.json(
        { error: 'Variant ID and session ID are required' },
        { status: 400 }
      )
    }
    
    const testId = id
    
    // Get user agent and referrer from headers
    const userAgent = request.headers.get('user-agent') || undefined
    const referrer = request.headers.get('referer') || undefined
    
    switch (eventType) {
      case 'view':
        await trackVariantView(testId, variantId, sessionId, {
          userAgent,
          referrer,
        })
        break
        
      case 'conversion':
        await trackConversion(
          testId,
          variantId,
          sessionId,
          eventData?.conversionType || 'default',
          eventData
        )
        break
        
      case 'click':
        await trackClick(
          testId,
          variantId,
          sessionId,
          eventData?.clickTarget || 'unknown',
          eventData
        )
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking A/B test event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

