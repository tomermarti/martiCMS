import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Pure static A/B testing - no database calls on frontend
export interface StaticABTest {
  id: string
  name: string
  testType: string
  variants: StaticVariant[]
}

export interface StaticVariant {
  id: string
  name: string
  isControl: boolean
  trafficPercent: number
  changes: any
}

export interface StaticTestConfig {
  articleId: string
  articleSlug: string
  timestamp: string
  tests: StaticABTest[]
}

export class PureStaticABTesting {
  
  // Generate static A/B test file from test configuration
  static async generateStaticTestFile(
    articleSlug: string, 
    testConfig: StaticTestConfig
  ) {
    try {
      // Create article directory
      const articleDir = join(process.cwd(), 'public', articleSlug)
      await mkdir(articleDir, { recursive: true })

      // Write JSON file
      const jsonPath = join(articleDir, 'ab-tests.json')
      await writeFile(jsonPath, JSON.stringify(testConfig, null, 2))

      console.log(`✅ Generated static A/B test file: ${jsonPath}`)
      return jsonPath
    } catch (error) {
      console.error('Error generating static test file:', error)
      throw error
    }
  }

  // Remove test file
  static async removeStaticTestFile(articleSlug: string) {
    try {
      const { unlink } = await import('fs/promises')
      const jsonPath = join(process.cwd(), 'public', articleSlug, 'ab-tests.json')
      
      try {
        await unlink(jsonPath)
        console.log(`✅ Removed static test file: ${jsonPath}`)
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
    } catch (error) {
      console.error('Error removing static test file:', error)
      throw error
    }
  }

  // Create test configuration from CMS data
  static createTestConfig(
    articleId: string,
    articleSlug: string,
    tests: any[]
  ): StaticTestConfig {
    return {
      articleId,
      articleSlug,
      timestamp: new Date().toISOString(),
      tests: tests.map(test => ({
        id: test.id,
        name: test.name,
        testType: test.testType,
        variants: test.variants.map((variant: any) => ({
          id: variant.id,
          name: variant.name,
          isControl: variant.isControl,
          trafficPercent: variant.trafficPercent,
          changes: variant.changes,
        })),
      })),
    }
  }
}

// Simple in-memory storage for CMS (no database needed for simple cases)
export class InMemoryABTestStorage {
  private static tests: Map<string, any[]> = new Map()

  static addTest(articleId: string, test: any) {
    const existing = this.tests.get(articleId) || []
    existing.push(test)
    this.tests.set(articleId, existing)
  }

  static getTests(articleId: string): any[] {
    return this.tests.get(articleId) || []
  }

  static updateTest(articleId: string, testId: string, updates: any) {
    const tests = this.tests.get(articleId) || []
    const index = tests.findIndex(t => t.id === testId)
    if (index >= 0) {
      tests[index] = { ...tests[index], ...updates }
      this.tests.set(articleId, tests)
    }
  }

  static deleteTest(articleId: string, testId: string) {
    const tests = this.tests.get(articleId) || []
    const filtered = tests.filter(t => t.id !== testId)
    this.tests.set(articleId, filtered)
  }

  static getRunningTests(articleId: string): any[] {
    const tests = this.tests.get(articleId) || []
    return tests.filter(t => t.status === 'running')
  }
}

