import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/templates/[id] - Get specific template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            article: {
              select: { id: true, title: true, slug: true }
            }
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      template
    })
  } catch (error: any) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT /api/templates/[id] - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, description, category, htmlContent, placeholders } = await request.json()

    if (!name || !htmlContent) {
      return NextResponse.json(
        { error: 'Name and HTML content are required' },
        { status: 400 }
      )
    }

    // Validate placeholders exist in HTML content
    const missingPlaceholders = placeholders.filter((placeholder: string) => 
      !htmlContent.includes(`{{${placeholder}}}`)
    )

    if (missingPlaceholders.length > 0) {
      return NextResponse.json(
        { 
          error: `Placeholders not found in HTML: ${missingPlaceholders.join(', ')}`,
          missingPlaceholders 
        },
        { status: 400 }
      )
    }

    const { id } = await params
    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        description,
        category,
        htmlContent,
        placeholders
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Template updated successfully!',
      template
    })
  } catch (error: any) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE /api/templates/[id] - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if template is being used by any variants
    const variantCount = await prisma.articleVariant.count({
      where: { templateId: id }
    })

    if (variantCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete template. It is being used by ${variantCount} variant(s).`,
          variantCount 
        },
        { status: 400 }
      )
    }

    await prisma.template.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully!'
    })
  } catch (error: any) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
