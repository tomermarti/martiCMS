import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { optimizeTrafficDistribution } from '@/lib/ab-testing'
import { regenerateABTestFile } from '@/lib/ab-testing-static'

// GET single A/B test
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const test = await prisma.aBTest.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { createdAt: 'asc' },
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })
    
    if (!test) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(test)
  } catch (error: any) {
    console.error('Error fetching A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to fetch A/B test' },
      { status: 500 }
    )
  }
}

// UPDATE A/B test
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      status,
      distributionMode,
      optimizationGoal,
      minSampleSize,
      confidenceLevel,
      variants,
    } = body
    
    // Build update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (distributionMode !== undefined) updateData.distributionMode = distributionMode
    if (optimizationGoal !== undefined) updateData.optimizationGoal = optimizationGoal
    if (minSampleSize !== undefined) updateData.minSampleSize = minSampleSize
    if (confidenceLevel !== undefined) updateData.confidenceLevel = confidenceLevel
    
    // Handle status changes
    if (status === 'running' && !updateData.startDate) {
      updateData.startDate = new Date()
    } else if (status === 'completed' && !updateData.endDate) {
      updateData.endDate = new Date()
    }
    
    // Update test
    const test = await prisma.aBTest.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
      },
    })
    
    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      // Validate traffic percentages
      const totalTraffic = variants.reduce((sum: number, v: any) => sum + v.trafficPercent, 0)
      if (Math.abs(totalTraffic - 100) > 0.01) {
        return NextResponse.json(
          { error: 'Traffic percentages must sum to 100%' },
          { status: 400 }
        )
      }
      
      // Update each variant
      for (const variant of variants) {
        if (variant.id) {
          await prisma.aBVariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name,
              description: variant.description,
              trafficPercent: variant.trafficPercent,
              changes: variant.changes,
            },
          })
        }
      }
    }
    
    // If switching to auto-pilot, run optimization
    if (distributionMode === 'auto_pilot') {
      await optimizeTrafficDistribution(id)
    }
    
    // Fetch updated test with variants
    const updatedTest = await prisma.aBTest.findUnique({
      where: { id: id },
      include: {
        variants: {
          orderBy: { createdAt: 'asc' },
        },
        article: {
          select: { id: true }
        }
      },
    })

    // Regenerate static JSON file
    if (updatedTest?.article) {
      await regenerateABTestFile(updatedTest.article.id)
    }

    return NextResponse.json(updatedTest)
  } catch (error: any) {
    console.error('Error updating A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to update A/B test' },
      { status: 500 }
    )
  }
}

// DELETE A/B test
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Get article ID before deleting
    const test = await prisma.aBTest.findUnique({
      where: { id: id },
      include: { article: { select: { id: true } } }
    })

    await prisma.aBTest.delete({
      where: { id: id },
    })

    // Regenerate static JSON file (will remove file if no active tests)
    if (test?.article) {
      await regenerateABTestFile(test.article.id)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to delete A/B test' },
      { status: 500 }
    )
  }
}

