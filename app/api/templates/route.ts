import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    const where: any = {}
    if (category) where.category = category
    if (active !== null) where.isActive = active === 'true'

    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      templates
    })
  } catch (error: any) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
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

    const template = await prisma.template.create({
      data: {
        name,
        description,
        category: category || 'custom',
        htmlContent,
        placeholders: placeholders || []
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Template created successfully!',
      template
    })
  } catch (error: any) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
