import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from './prisma'

// Static A/B testing - generates JSON files instead of API calls
export class StaticABTesting {
  
  // Generate A/B test JSON file for an article
  static async generateTestFile(articleId: string, articleSlug: string) {
    try {
      // Get active tests for this article
      const tests = await prisma.aBTest.findMany({
        where: { 
          articleId,
          status: 'running' // Only include running tests
        },
        include: {
          variants: {
            orderBy: { createdAt: 'asc' },
          },
        },
      })

      // Transform data for frontend consumption
      const testData = {
        articleId,
        articleSlug,
        timestamp: new Date().toISOString(),
        tests: tests.map(test => ({
          id: test.id,
          name: test.name,
          testType: test.testType,
          distributionMode: test.distributionMode,
          optimizationGoal: test.optimizationGoal,
          variants: test.variants.map(variant => ({
            id: variant.id,
            name: variant.name,
            isControl: variant.isControl,
            trafficPercent: variant.trafficPercent,
            changes: variant.changes,
          })),
        })),
      }

      // Create article directory if it doesn't exist
      const articleDir = join(process.cwd(), 'public', articleSlug)
      await mkdir(articleDir, { recursive: true })

      // Write JSON file
      const jsonPath = join(articleDir, 'ab-tests.json')
      await writeFile(jsonPath, JSON.stringify(testData, null, 2))

      console.log(`✅ Generated A/B test file: ${jsonPath}`)
      return jsonPath
    } catch (error) {
      console.error('Error generating A/B test file:', error)
      throw error
    }
  }

  // Generate test files for all articles with active tests
  static async generateAllTestFiles() {
    try {
      // Get all articles with running tests
      const articlesWithTests = await prisma.article.findMany({
        where: {
          abTests: {
            some: {
              status: 'running'
            }
          }
        },
        include: {
          abTests: {
            where: { status: 'running' },
            include: { variants: true }
          }
        }
      })

      const results = []
      for (const article of articlesWithTests) {
        const filePath = await this.generateTestFile(article.id, article.slug)
        results.push({ articleId: article.id, slug: article.slug, filePath })
      }

      console.log(`✅ Generated ${results.length} A/B test files`)
      return results
    } catch (error) {
      console.error('Error generating all test files:', error)
      throw error
    }
  }

  // Remove test file when no active tests
  static async removeTestFile(articleSlug: string) {
    try {
      const { unlink } = await import('fs/promises')
      const jsonPath = join(process.cwd(), 'public', articleSlug, 'ab-tests.json')
      
      try {
        await unlink(jsonPath)
        console.log(`✅ Removed A/B test file: ${jsonPath}`)
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error
        }
        // File doesn't exist, that's fine
      }
    } catch (error) {
      console.error('Error removing A/B test file:', error)
      throw error
    }
  }

  // Purge CDN cache for test file (similar to your current purging)
  static async purgeTestFile(articleSlug: string) {
    try {
      // Add your CDN purging logic here
      // Similar to how you purge static article files
      const testFileUrl = `https://your-cdn.com/${articleSlug}/ab-tests.json`
      
      // Example purge call (adjust to your CDN)
      // await fetch('https://api.your-cdn.com/purge', {
      //   method: 'POST',
      //   body: JSON.stringify({ urls: [testFileUrl] })
      // })
      
      console.log(`✅ Purged CDN cache for: ${testFileUrl}`)
    } catch (error) {
      console.error('Error purging test file cache:', error)
      throw error
    }
  }

  // Update test file when test changes
  static async updateTestFile(articleId: string) {
    try {
      // Get article slug
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { slug: true }
      })

      if (!article) {
        throw new Error(`Article not found: ${articleId}`)
      }

      // Check if there are any tests (draft or running) - we want to generate file for draft tests too
      const allTests = await prisma.aBTest.count({
        where: { 
          articleId,
          status: { in: ['draft', 'running'] } // Include draft tests
        }
      })

      if (allTests > 0) {
        // Generate new test file (will include running tests only in the JSON)
        await this.generateTestFile(articleId, article.slug)
        // Purge CDN cache
        await this.purgeTestFile(article.slug)
      } else {
        // Remove test file if no tests at all
        await this.removeTestFile(article.slug)
        // Purge CDN cache
        await this.purgeTestFile(article.slug)
      }
    } catch (error) {
      console.error('Error updating test file:', error)
      throw error
    }
  }
}

// Helper function to trigger file generation
export async function regenerateABTestFile(articleId: string) {
  return StaticABTesting.updateTestFile(articleId)
}

// Helper function to regenerate all test files
export async function regenerateAllABTestFiles() {
  return StaticABTesting.generateAllTestFiles()
}
