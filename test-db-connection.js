import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test successful:', result)
    
    // Test if our tables exist
    try {
      const count = await prisma.article.count()
      console.log('✅ CMS tables exist! Article count:', count)
    } catch (error) {
      console.log('❌ CMS tables do not exist:', error.message)
      console.log('Error code:', error.code)
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
