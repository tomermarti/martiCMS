'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import analytics from '@/lib/mixpanel'

// Check if analytics cookies are accepted
function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) return false
    
    const preferences = JSON.parse(consent)
    return preferences.analytics === true
  } catch (error) {
    return false
  }
}

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Only track page views if analytics cookies are accepted
    if (pathname && hasAnalyticsConsent()) {
      analytics.trackPageView(pathname, {
        path: pathname,
        referrer: document.referrer,
      })
    }
  }, [pathname])

  return <>{children}</>
}

