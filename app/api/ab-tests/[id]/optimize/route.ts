import { NextRequest, NextResponse } from 'next/server'
import { optimizeTrafficDistribution } from '@/lib/ab-testing'
import { prisma } from '@/lib/prisma'

// Trigger auto-pilot optimization
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params
    
    // Run optimization
    await optimizeTrafficDistribution(testId)
    
    // Fetch updated test
    const test = await prisma.aBTest.findUnique({
      where: { id: testId },
      include: {
        variants: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    
    return NextResponse.json({
      success: true,
      test,
    })
  } catch (error: any) {
    console.error('Error optimizing traffic distribution:', error)
    return NextResponse.json(
      { error: 'Failed to optimize traffic distribution' },
      { status: 500 }
    )
  }
}

