import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to query a table to see if schema exists
    try {
      await prisma.article.findFirst()
      return NextResponse.json({ 
        success: true, 
        message: 'Database is already initialized and working!' 
      })
    } catch (error: any) {
      // If tables don't exist, we need to create them
      if (error.code === 'P2021' || error.message.includes('does not exist')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Database tables do not exist. Please run database migration.',
          details: 'The CMS tables need to be created. Contact your administrator to run: npx prisma db push'
        }, { status: 500 })
      }
      
      throw error
    }
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check database status
    await prisma.$connect()
    
    // Check if tables exist by trying to count articles
    const count = await prisma.article.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database is working!',
      articlesCount: count,
      status: 'ready'
    })
  } catch (error: any) {
    console.error('Database check error:', error)
    
    let status = 'unknown'
    let message = 'Database check failed'
    
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      status = 'tables_missing'
      message = 'Database connected but CMS tables do not exist'
    } else if (error.message.includes('connect')) {
      status = 'connection_failed'
      message = 'Cannot connect to database'
    }
    
    return NextResponse.json({ 
      success: false, 
      error: message,
      status,
      details: error.message 
    }, { status: 500 })
  }
}
