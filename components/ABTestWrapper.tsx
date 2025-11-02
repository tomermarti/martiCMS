'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSessionId, getDeviceType } from '@/lib/ab-testing'
import analytics from '@/lib/mixpanel'

interface ABTestWrapperProps {
  articleId: string
  articleSlug: string
  children: React.ReactNode
  onVariantAssigned?: (variantId: string, changes: any) => void
}

export default function ABTestWrapper({
  articleId,
  articleSlug,
  children,
  onVariantAssigned,
}: ABTestWrapperProps) {
  const [variantId, setVariantId] = useState<string | null>(null)
  const [variantChanges, setVariantChanges] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeABTest()
  }, [articleId])

  const initializeABTest = async () => {
    try {
      const sessionId = getSessionId()
      
      // Fetch active A/B test for this article
      const response = await fetch(`/api/ab-tests?articleId=${articleId}`)
      if (!response.ok) {
        setLoading(false)
        return
      }
      
      const tests = await response.json()
      const activeTest = tests.find((t: any) => t.status === 'running')
      
      if (!activeTest || !activeTest.variants || activeTest.variants.length === 0) {
        setLoading(false)
        return
      }
      
      // Assign variant based on session
      const assignedVariant = await assignVariantForSession(
        activeTest.id,
        activeTest.variants,
        sessionId
      )
      
      if (assignedVariant) {
        setVariantId(assignedVariant.id)
        setVariantChanges(assignedVariant.changes)
        
        // Track variant view
        await trackView(activeTest.id, assignedVariant.id, sessionId)
        
        // Track in Mixpanel
        analytics.trackVariantView(
          activeTest.id,
          assignedVariant.id,
          assignedVariant.name,
          {
            article_id: articleId,
            article_slug: articleSlug,
            session_id: sessionId,
            is_control: assignedVariant.isControl,
            traffic_percent: assignedVariant.trafficPercent,
            device_type: getDeviceType(),
          }
        )
        
        // Track article view
        analytics.trackArticleView(articleId, articleSlug, {
          test_id: activeTest.id,
          variant_id: assignedVariant.id,
          variant_name: assignedVariant.name,
        })
        
        // Notify parent component
        if (onVariantAssigned) {
          onVariantAssigned(assignedVariant.id, assignedVariant.changes)
        }
      }
    } catch (error) {
      console.error('Error initializing A/B test:', error)
    } finally {
      setLoading(false)
    }
  }

  const assignVariantForSession = async (
    testId: string,
    variants: any[],
    sessionId: string
  ) => {
    // Check if session already has a variant assigned
    const storageKey = `ab_test_${testId}_variant`
    const storedVariantId = localStorage.getItem(storageKey)
    
    if (storedVariantId) {
      const variant = variants.find((v) => v.id === storedVariantId)
      if (variant) {
        return variant
      }
    }
    
    // Assign new variant using consistent hashing
    const hash = hashString(sessionId + testId)
    const randomValue = (hash % 10000) / 100 // 0-100
    
    let cumulative = 0
    for (const variant of variants) {
      cumulative += variant.trafficPercent
      if (randomValue < cumulative) {
        // Store assignment
        localStorage.setItem(storageKey, variant.id)
        return variant
      }
    }
    
    // Fallback to control
    const control = variants.find((v) => v.isControl) || variants[0]
    localStorage.setItem(storageKey, control.id)
    return control
  }

  const trackView = async (testId: string, variantId: string, sessionId: string) => {
    try {
      await fetch(`/api/ab-tests/${testId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'view',
          variantId,
          sessionId,
        }),
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  // Track conversion (call this from parent component when conversion happens)
  const trackConversion = async (conversionType: string = 'default', eventData?: any) => {
    if (!variantId) return
    
    try {
      const sessionId = getSessionId()
      const testId = localStorage.getItem(`ab_test_${variantId}_test`) // Need to store this
      
      if (testId) {
        await fetch(`/api/ab-tests/${testId}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'conversion',
            variantId,
            sessionId,
            eventData: { conversionType, ...eventData },
          }),
        })
        
        analytics.trackConversion(testId, variantId, conversionType, {
          article_id: articleId,
          article_slug: articleSlug,
          session_id: sessionId,
          device_type: getDeviceType(),
          ...eventData,
        })
      }
    } catch (error) {
      console.error('Error tracking conversion:', error)
    }
  }

  // Track click (call this from parent component when important clicks happen)
  const trackClick = async (clickTarget: string, eventData?: any) => {
    if (!variantId) return
    
    try {
      const sessionId = getSessionId()
      const testId = localStorage.getItem(`ab_test_${variantId}_test`)
      
      if (testId) {
        await fetch(`/api/ab-tests/${testId}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'click',
            variantId,
            sessionId,
            eventData: { clickTarget, ...eventData },
          }),
        })
        
        analytics.trackArticleClick(articleId, clickTarget, {
          test_id: testId,
          variant_id: variantId,
          session_id: sessionId,
          device_type: getDeviceType(),
          ...eventData,
        })
      }
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  // Expose tracking functions to children via context or props
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).abTestTrackConversion = trackConversion
      // @ts-ignore
      (window as any).abTestTrackClick = trackClick
    }
  }, [variantId])

  if (loading) {
    return <>{children}</>
  }

  return <>{children}</>
}

// Hash function for consistent variant assignment
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

