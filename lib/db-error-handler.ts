import { NextResponse } from 'next/server'

export function handleDatabaseError(error: any, operation: string = 'operation') {
  console.error(`Database error during ${operation}:`, error)
  
  // Handle table/schema not found
  if (error.message?.includes('does not exist') || 
      error.message?.includes('relation') ||
      error.code === 'P2021') {
    return NextResponse.json({
      success: false,
      error: 'Database schema issue',
      message: `Cannot perform ${operation}. Database tables need to be created or matched to the app schema.`,
      details: 'The required database tables do not match the application schema.'
    }, { status: 503 })
  }
  
  // Handle database connection issues
  if (error.message?.includes('Can\'t reach database') || 
      error.message?.includes('connect') || 
      error.message?.includes('ENOTFOUND') ||
      error.message?.includes('ECONNREFUSED') ||
      error.code === 'P1001') { // Connection error
    return NextResponse.json({
      success: false,
      error: 'Database connection issue',
      message: `Cannot perform ${operation}. Database connection needed.`,
      details: 'The database is currently unavailable. Please check your database configuration.'
    }, { status: 503 })
  }
  
  // Handle permission errors
  if (error.message?.includes('permission denied') || 
      error.code === 'P2010') {
    return NextResponse.json({
      success: false,
      error: 'Database permission error',
      message: `Cannot perform ${operation}. Database permissions needed.`,
      details: 'The database user does not have sufficient permissions.'
    }, { status: 503 })
  }
  
  // Generic database error
  return NextResponse.json({
    success: false,
    error: `Failed to ${operation}`,
    details: error.message
  }, { status: 500 })
}

export function isDatabaseError(error: any): boolean {
  return (
    error.message?.includes('Can\'t reach database') ||
    error.message?.includes('connect') ||
    error.message?.includes('ENOTFOUND') ||
    error.message?.includes('ECONNREFUSED') ||
    error.message?.includes('permission denied') ||
    error.message?.includes('does not exist') ||
    error.code === 'P1001' ||
    error.code === 'P2010' ||
    error.code === 'P2021'
  )
}
