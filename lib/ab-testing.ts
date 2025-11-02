import { prisma } from './prisma'
import analytics from './mixpanel'

// Generate or retrieve session ID for anonymous users
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('ab_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('ab_session_id', sessionId)
  }
  return sessionId
}

// Get device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Assign user to a variant based on traffic distribution
export function assignVariant(
  variants: Array<{ id: string; trafficPercent: number; isControl: boolean }>,
  sessionId: string
): string {
  // Use consistent hashing for the same session
  const hash = hashString(sessionId)
  const randomValue = (hash % 10000) / 100 // 0-100
  
  let cumulative = 0
  for (const variant of variants) {
    cumulative += variant.trafficPercent
    if (randomValue < cumulative) {
      return variant.id
    }
  }
  
  // Fallback to control variant
  const control = variants.find(v => v.isControl)
  return control?.id || variants[0]?.id || ''
}

// Simple hash function for consistent variant assignment
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Get active A/B test for an article
export async function getActiveABTest(articleId: string) {
  const test = await prisma.aBTest.findFirst({
    where: {
      articleId,
      status: 'running',
    },
    include: {
      variants: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
  
  return test
}

// Get variant for current session
export async function getVariantForSession(
  testId: string,
  sessionId: string
): Promise<any> {
  const test = await prisma.aBTest.findUnique({
    where: { id: testId },
    include: {
      variants: true,
    },
  })
  
  if (!test || test.status !== 'running') {
    return null
  }
  
  // Check if session already has a variant assigned
  const existingEvent = await prisma.aBTestEvent.findFirst({
    where: {
      testId,
      sessionId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  if (existingEvent) {
    return test.variants.find(v => v.id === existingEvent.variantId)
  }
  
  // Assign new variant
  const variantId = assignVariant(test.variants, sessionId)
  const variant = test.variants.find(v => v.id === variantId)
  
  return variant
}

// Track variant view
export async function trackVariantView(
  testId: string,
  variantId: string,
  sessionId: string,
  context?: {
    userId?: string
    userAgent?: string
    referrer?: string
  }
) {
  // Save to database
  await prisma.aBTestEvent.create({
    data: {
      testId,
      variantId,
      sessionId,
      eventType: 'view',
      userId: context?.userId,
      userAgent: context?.userAgent,
      referrer: context?.referrer,
      deviceType: getDeviceType(),
    },
  })
  
  // Update variant view count
  await prisma.aBVariant.update({
    where: { id: variantId },
    data: {
      views: {
        increment: 1,
      },
    },
  })
  
  // Track in Mixpanel
  const variant = await prisma.aBVariant.findUnique({
    where: { id: variantId },
  })
  
  if (variant) {
    analytics.trackVariantView(testId, variantId, variant.name, {
      session_id: sessionId,
      is_control: variant.isControl,
      traffic_percent: variant.trafficPercent,
      device_type: getDeviceType(),
    })
  }
}

// Track conversion
export async function trackConversion(
  testId: string,
  variantId: string,
  sessionId: string,
  conversionType: string = 'default',
  eventData?: any
) {
  // Save to database
  await prisma.aBTestEvent.create({
    data: {
      testId,
      variantId,
      sessionId,
      eventType: 'conversion',
      eventData,
      deviceType: getDeviceType(),
    },
  })
  
  // Update variant conversion count
  await prisma.aBVariant.update({
    where: { id: variantId },
    data: {
      conversions: {
        increment: 1,
      },
    },
  })
  
  // Recalculate conversion rate
  const variant = await prisma.aBVariant.findUnique({
    where: { id: variantId },
  })
  
  if (variant && variant.views > 0) {
    const conversionRate = (variant.conversions / variant.views) * 100
    await prisma.aBVariant.update({
      where: { id: variantId },
      data: {
        conversionRate,
      },
    })
  }
  
  // Track in Mixpanel
  if (variant) {
    analytics.trackConversion(testId, variantId, conversionType, {
      session_id: sessionId,
      is_control: variant.isControl,
      device_type: getDeviceType(),
      event_data: eventData,
    })
  }
}

// Track click event
export async function trackClick(
  testId: string,
  variantId: string,
  sessionId: string,
  clickTarget: string,
  eventData?: any
) {
  await prisma.aBTestEvent.create({
    data: {
      testId,
      variantId,
      sessionId,
      eventType: 'click',
      eventData: { clickTarget, ...eventData },
      deviceType: getDeviceType(),
    },
  })
  
  // Update variant click count
  await prisma.aBVariant.update({
    where: { id: variantId },
    data: {
      clicks: {
        increment: 1,
      },
    },
  })
  
  // Recalculate CTR
  const variant = await prisma.aBVariant.findUnique({
    where: { id: variantId },
  })
  
  if (variant && variant.views > 0) {
    const clickThroughRate = (variant.clicks / variant.views) * 100
    await prisma.aBVariant.update({
      where: { id: variantId },
      data: {
        clickThroughRate,
      },
    })
  }
}

// Calculate statistical significance (Chi-square test)
export function calculateSignificance(
  controlViews: number,
  controlConversions: number,
  variantViews: number,
  variantConversions: number
): { isSignificant: boolean; pValue: number } {
  // Minimum sample size check
  if (controlViews < 30 || variantViews < 30) {
    return { isSignificant: false, pValue: 1 }
  }
  
  const controlRate = controlConversions / controlViews
  const variantRate = variantConversions / variantViews
  
  // Pooled probability
  const pooledProb = (controlConversions + variantConversions) / (controlViews + variantViews)
  
  // Standard error
  const se = Math.sqrt(pooledProb * (1 - pooledProb) * (1 / controlViews + 1 / variantViews))
  
  // Z-score
  const zScore = (variantRate - controlRate) / se
  
  // P-value (two-tailed test)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))
  
  // Significant if p-value < 0.05 (95% confidence)
  return {
    isSignificant: pValue < 0.05,
    pValue,
  }
}

// Normal CDF approximation
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp(-x * x / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - prob : prob
}

// Auto-pilot optimization: Adjust traffic based on performance
export async function optimizeTrafficDistribution(testId: string) {
  const test = await prisma.aBTest.findUnique({
    where: { id: testId },
    include: {
      variants: true,
    },
  })
  
  if (!test || test.distributionMode !== 'auto_pilot' || test.status !== 'running') {
    return
  }
  
  const control = test.variants.find(v => v.isControl)
  if (!control) return
  
  // Check if we have minimum sample size
  const totalViews = test.variants.reduce((sum, v) => sum + v.views, 0)
  if (totalViews < test.minSampleSize) {
    return
  }
  
  // Find best performing variant based on optimization goal
  let bestVariant = control
  let bestScore = getVariantScore(control, test.optimizationGoal || 'conversions')
  
  for (const variant of test.variants) {
    if (variant.id === control.id) continue
    
    const score = getVariantScore(variant, test.optimizationGoal || 'conversions')
    const { isSignificant } = calculateSignificance(
      control.views,
      control.conversions,
      variant.views,
      variant.conversions
    )
    
    // Update significance in database
    await prisma.aBVariant.update({
      where: { id: variant.id },
      data: { isSignificant },
    })
    
    if (isSignificant && score > bestScore) {
      bestVariant = variant
      bestScore = score
    }
  }
  
  // Redistribute traffic: 90% to winner, 10% split among others
  if (bestVariant.id !== control.id) {
    const otherVariants = test.variants.filter(v => v.id !== bestVariant.id)
    const otherTrafficPercent = 10 / otherVariants.length
    
    await prisma.aBVariant.update({
      where: { id: bestVariant.id },
      data: { trafficPercent: 90 },
    })
    
    for (const variant of otherVariants) {
      await prisma.aBVariant.update({
        where: { id: variant.id },
        data: { trafficPercent: otherTrafficPercent },
      })
    }
    
    // Update winning variant
    await prisma.aBTest.update({
      where: { id: testId },
      data: { winningVariantId: bestVariant.id },
    })
  }
}

// Get variant score based on optimization goal
function getVariantScore(variant: any, goal: string): number {
  switch (goal) {
    case 'conversions':
      return variant.conversionRate
    case 'engagement':
      return variant.clickThroughRate
    case 'time_on_page':
      return variant.avgTimeOnPage
    case 'click_through':
      return variant.clickThroughRate
    default:
      return variant.conversionRate
  }
}

// Merge variant changes with article content
export function applyVariantChanges(article: any, variantChanges: any): any {
  const modified = { ...article }
  
  // Apply changes based on variant type
  if (variantChanges.title) {
    modified.title = variantChanges.title
  }
  
  if (variantChanges.metaTitle) {
    modified.metaTitle = variantChanges.metaTitle
  }
  
  if (variantChanges.metaDescription) {
    modified.metaDescription = variantChanges.metaDescription
  }
  
  if (variantChanges.featuredImage) {
    modified.featuredImage = variantChanges.featuredImage
  }
  
  if (variantChanges.content) {
    modified.content = { ...modified.content, ...variantChanges.content }
  }
  
  if (variantChanges.layout) {
    modified.layout = variantChanges.layout
  }
  
  if (variantChanges.ctaText || variantChanges.ctaColor || variantChanges.ctaPosition) {
    modified.cta = {
      text: variantChanges.ctaText || modified.cta?.text,
      color: variantChanges.ctaColor || modified.cta?.color,
      position: variantChanges.ctaPosition || modified.cta?.position,
    }
  }
  
  return modified
}

