'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import analytics from '@/lib/mixpanel'

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views with full context (includes UTM parameters and A/B test data)
    if (pathname) {
      analytics.trackPageView(pathname, {
        path: pathname,
        referrer: document.referrer,
      })
    }
  }, [pathname])

  return <>{children}</>
}

