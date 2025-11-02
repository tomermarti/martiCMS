import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/articles/[id]/variants/[variantId] - Get specific variant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params
    const variant = await prisma.articleVariant.findFirst({
      where: { 
        id: variantId,
        articleId: id
      },
      include: {
        template: true,
        article: {
          select: { id: true, title: true, slug: true }
        }
      }
    })

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      variant
    })
  } catch (error: any) {
    console.error('Error fetching variant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variant' },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[id]/variants/[variantId] - Update variant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params
    const { name, description, templateId, isControl, trafficPercent, data, isActive } = await request.json()

    // Validate traffic percentage if provided
    if (trafficPercent !== undefined && (trafficPercent < 0 || trafficPercent > 100)) {
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
          isControl: true,
          id: { not: variantId }
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

    // Get current variant to check template change
    const currentVariant = await prisma.articleVariant.findUnique({
      where: { id: variantId },
      select: { templateId: true }
    })

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (templateId !== undefined) updateData.templateId = templateId || null
    if (isControl !== undefined) updateData.isControl = isControl
    if (trafficPercent !== undefined) updateData.trafficPercent = trafficPercent
    if (data !== undefined) updateData.data = data
    if (isActive !== undefined) updateData.isActive = isActive

    const variant = await prisma.articleVariant.update({
      where: { id: variantId },
      data: updateData,
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

    // Update template usage counts if template changed
    if (templateId !== undefined && currentVariant) {
      // Decrement old template usage
      if (currentVariant.templateId) {
        await prisma.template.update({
          where: { id: currentVariant.templateId },
          data: { usageCount: { decrement: 1 } }
        })
      }
      
      // Increment new template usage
      if (templateId) {
        await prisma.template.update({
          where: { id: templateId },
          data: { usageCount: { increment: 1 } }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Variant updated successfully!',
      variant
    })
  } catch (error: any) {
    console.error('Error updating variant:', error)
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[id]/variants/[variantId] - Delete variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params
    // Get variant info before deletion
    const variant = await prisma.articleVariant.findUnique({
      where: { id: variantId },
      select: { templateId: true }
    })

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      )
    }

    // Delete the variant
    await prisma.articleVariant.delete({
      where: { id: variantId }
    })

    // Decrement template usage count
    if (variant.templateId) {
      await prisma.template.update({
        where: { id: variant.templateId },
        data: { usageCount: { decrement: 1 } }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Variant deleted successfully!'
    })
  } catch (error: any) {
    console.error('Error deleting variant:', error)
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    )
  }
}
