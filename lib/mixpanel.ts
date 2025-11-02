// Dynamic import for mixpanel-browser to avoid SSR issues
let mixpanel: any = null

// Initialize Mixpanel
const MIXPANEL_TOKEN = 'e474bceac7e0d60bc3c4cb27aaf1d4f7'

// Load mixpanel only on client side
if (typeof window !== 'undefined') {
  import('mixpanel-browser').then((module) => {
    mixpanel = module.default
  }).catch((error) => {
    console.error('Failed to load mixpanel-browser:', error)
  })
}

// Track initialization state
let isInitialized = false

// Check if analytics cookies are accepted
function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) return false
    
    const preferences = JSON.parse(consent)
    return preferences.analytics === true
  } catch (error) {
    console.error('Failed to check cookie consent:', error)
    return false
  }
}

// Initialize only on client side and only if consent is given
if (typeof window !== 'undefined') {
  // Don't initialize immediately - wait for consent check
  // Initialization will happen on first tracking call if consent is given
}

// Helper to ensure Mixpanel is initialized (only if consent is given)
function ensureInitialized(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check if mixpanel is loaded
  if (!mixpanel) {
    console.log('Mixpanel: Library not loaded yet')
    return false
  }
  
  // Check if analytics consent is given
  if (!hasAnalyticsConsent()) {
    console.log('Mixpanel: Analytics cookies not accepted, skipping initialization')
    return false
  }
  
  if (!isInitialized) {
    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false,
        persistence: 'localStorage',
        ignore_dnt: false,
      })
      isInitialized = true
      console.log('Mixpanel initialized on demand')
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error)
      return false
    }
  }
  
  return isInitialized
}

// Extract ALL URL parameters and tracking data from URL
export function getTrackingParameters(): Record<string, any> {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  const trackingData: Record<string, any> = {}
  
  // Parse ALL URL parameters - no limitations
  for (const [key, value] of urlParams.entries()) {
    trackingData[key] = value
  }
  
  // Add referrer information
  if (document.referrer) {
    trackingData.page_referrer = document.referrer
    
    // Extract domain from referrer
    try {
      const referrerUrl = new URL(document.referrer)
      trackingData.referrer_domain = referrerUrl.hostname
    } catch (e) {
      // Invalid referrer URL
    }
  }
  
  // Add page information
  trackingData.page_url = window.location.href
  trackingData.page_path = window.location.pathname
  trackingData.page_title = document.title
  
  // Add hash parameters if present
  if (window.location.hash) {
    trackingData.page_hash = window.location.hash
    
    // Parse hash parameters (format: #param1=value1&param2=value2)
    if (window.location.hash.includes('=')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      for (const [key, value] of hashParams.entries()) {
        trackingData[`hash_${key}`] = value
      }
    }
  }
  
  return trackingData
}

// Get current A/B test context
export function getABTestContext(): Record<string, any> {
  if (typeof window === 'undefined') return {}
  
  const context: Record<string, any> = {}
  
  // Try to get A/B test data from various sources
  if ((window as any).abTestData) {
    const abData = (window as any).abTestData
    if (abData.currentTest) {
      context.test_id = abData.currentTest.id
      context.test_name = abData.currentTest.name
      context.test_type = abData.currentTest.testType
    }
    if (abData.currentVariant) {
      context.variant_id = abData.currentVariant.id
      context.variant_name = abData.currentVariant.name
      context.is_control = abData.currentVariant.isControl
      context.traffic_percent = abData.currentVariant.trafficPercent
    }
  }
  
  // Try to get session ID
  const sessionId = localStorage.getItem('ab_session_id')
  if (sessionId) {
    context.session_id = sessionId
  }
  
  return context
}

// Enhanced tracking function that includes all context
export function trackWithFullContext(eventName: string, properties: Record<string, any> = {}): void {
  if (!ensureInitialized()) return
  
  const trackingParams = getTrackingParameters()
  const abTestContext = getABTestContext()
  
  // Get device type
  const getDeviceType = () => {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }
  
  const fullProperties = {
    ...trackingParams,
    ...abTestContext,
    device_type: getDeviceType(),
    timestamp: new Date().toISOString(),
    ...properties // User properties override defaults
  }
  
  try {
    mixpanel.track(eventName, fullProperties)
    console.log(`Tracked: ${eventName}`, fullProperties)
  } catch (error) {
    console.error(`Failed to track ${eventName}:`, error)
  }
}

// Mixpanel tracking utilities
export const analytics = {
  // Identify user
  identify: (userId: string, traits?: Record<string, any>) => {
    if (!ensureInitialized()) return
    mixpanel.identify(userId)
    if (traits) {
      mixpanel.people.set(traits)
    }
  },

  // Track events with full context
  track: (eventName: string, properties?: Record<string, any>) => {
    trackWithFullContext(eventName, properties)
  },

  // Track page views with full context
  trackPageView: (pageName: string, properties?: Record<string, any>) => {
    trackWithFullContext('Page View', {
      page: pageName,
      ...properties,
    })
  },

  // Track A/B test variant view with full context
  trackVariantView: (testId: string, variantId: string, variantName: string, properties?: Record<string, any>) => {
    trackWithFullContext('Variant Viewed', {
      test_id: testId,
      variant_id: variantId,
      variant_name: variantName,
      ...properties,
    })
  },

  // Track conversion events with full context
  trackConversion: (testId: string, variantId: string, conversionType: string, properties?: Record<string, any>) => {
    trackWithFullContext('Conversion', {
      test_id: testId,
      variant_id: variantId,
      conversion_type: conversionType,
      ...properties,
    })
  },

  // Track article interactions with full context
  trackArticleView: (articleId: string, articleSlug: string, properties?: Record<string, any>) => {
    trackWithFullContext('Article Viewed', {
      article_id: articleId,
      article_slug: articleSlug,
      ...properties,
    })
  },

  trackArticleClick: (articleId: string, clickType: string, properties?: Record<string, any>) => {
    trackWithFullContext('Article Click', {
      article_id: articleId,
      click_type: clickType,
      ...properties,
    })
  },

  // Track CTA clicks with full context
  trackCTAClick: (ctaName: string, ctaLocation: string, properties?: Record<string, any>) => {
    trackWithFullContext('CTA Clicked', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      ...properties,
    })
  },

  // Set user properties
  setUserProperties: (properties: Record<string, any>) => {
    if (!ensureInitialized()) return
    mixpanel.people.set(properties)
  },

  // Increment user property
  incrementUserProperty: (property: string, value: number = 1) => {
    if (!ensureInitialized()) return
    mixpanel.people.increment(property, value)
  },

  // Reset user (for logout)
  reset: () => {
    if (!ensureInitialized()) return
    mixpanel.reset()
  },
}

export default analytics


