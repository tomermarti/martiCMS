import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/articles/[id]/variants - List variants for an article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const variants = await prisma.articleVariant.findMany({
      where: { articleId: id },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true,
            placeholders: true
          }
        }
      },
      orderBy: [
        { isControl: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      variants
    })
  } catch (error: any) {
    console.error('Error fetching variants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    )
  }
}

// POST /api/articles/[id]/variants - Create new variant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, description, templateId, isControl, trafficPercent, data } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Variant name is required' },
        { status: 400 }
      )
    }

    // Validate traffic percentage
    if (trafficPercent < 0 || trafficPercent > 100) {
      return NextResponse.json(
        { error: 'Traffic percentage must be between 0 and 100' },
        { status: 400 }
      )
    }

    // If this is being set as control, unset other control variants
    if (isControl) {
      await prisma.articleVariant.updateMany({
        where: { 
          articleId: id,
          isControl: true
        },
        data: { isControl: false }
      })
    }

    // Validate template placeholders if template is used
    if (templateId && data) {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        select: { placeholders: true }
      })

      if (template) {
        const missingPlaceholders = template.placeholders.filter(
          placeholder => !(placeholder in data)
        )

        if (missingPlaceholders.length > 0) {
          return NextResponse.json(
            { 
              error: `Missing data for template placeholders: ${missingPlaceholders.join(', ')}`,
              missingPlaceholders 
            },
            { status: 400 }
          )
        }
      }
    }

    const variant = await prisma.articleVariant.create({
      data: {
        name,
        description,
        articleId: id,
        templateId: templateId || null,
        isControl: isControl || false,
        trafficPercent: trafficPercent || 50,
        data: data || {}
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true,
            placeholders: true
          }
        }
      }
    })

    // Update template usage count
    if (templateId) {
      await prisma.template.update({
        where: { id: templateId },
        data: { usageCount: { increment: 1 } }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Variant created successfully!',
      variant
    })
  } catch (error: any) {
    console.error('Error creating variant:', error)
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    )
  }
}
