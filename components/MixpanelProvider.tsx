'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import analytics, { canTrackAnalytics } from '@/lib/mixpanel'

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Track by default unless the user explicitly rejects analytics cookies.
    if (pathname && canTrackAnalytics()) {
      analytics.trackPageView(pathname, {
        path: pathname,
        referrer: document.referrer,
      })
    }
  }, [pathname])

  return <>{children}</>
}

