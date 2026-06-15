'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import analytics from '@/lib/mixpanel'

const META_PIXEL_ID = '1999175120710355'

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[]
  loaded?: boolean
  version?: string
  push?: FbqFunction
}

declare global {
  interface Window {
    fbq?: FbqFunction
    _fbq?: FbqFunction
    martiInitializedMetaPixels?: Set<string>
  }
}

interface PublicArticleRendererProps {
  html: string
  article: {
    id: string
    slug: string
    title: string
    author: string
    facebookPixel?: string | null
  }
}

function loadMetaPixel(pixelId: string) {
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args)
      } else {
        fbq.queue?.push(args)
      }
    } as FbqFunction

    fbq.queue = []
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.push = fbq

    window.fbq = fbq
    window._fbq = fbq

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }

  window.martiInitializedMetaPixels ??= new Set<string>()

  if (!window.martiInitializedMetaPixels.has(pixelId)) {
    window.fbq?.('init', pixelId)
    window.martiInitializedMetaPixels.add(pixelId)
  }
}

function isClickoutUrl(href: string) {
  return (
    href.includes('amazon.com') ||
    href.includes('amzn.to') ||
    href.includes('tracking.martideals.com/partners/')
  )
}

export default function PublicArticleRenderer({ html, article }: PublicArticleRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const trackedArticleIdRef = useRef<string | null>(null)
  const { id, slug, title, author, facebookPixel } = article

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const campaign = searchParams.get('utm_campaign')
    if (!campaign) return

    container.querySelectorAll<HTMLAnchorElement>('.listicle-cta[data-asin]').forEach((link) => {
      const asin = link.dataset.asin
      if (!asin) return

      link.href = `https://tracking.martideals.com/partners/asin-redirect?asin=${encodeURIComponent(asin)}&redirectId=pools-${encodeURIComponent(campaign)}`
    })
  }, [searchParams])

  useEffect(() => {
    const pixelId = facebookPixel || META_PIXEL_ID

    loadMetaPixel(pixelId)
    window.fbq?.('track', 'PageView')

    if (trackedArticleIdRef.current !== id) {
      analytics.track('Article Page View', {
        article_id: id,
        article_slug: slug,
        article_title: title,
        author,
        page_url: window.location.href,
        page_path: window.location.pathname,
        referrer: document.referrer,
      })
      trackedArticleIdRef.current = id
    }
  }, [author, facebookPixel, id, slug, title])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const link = target.closest<HTMLAnchorElement>('a')
      if (!link) return

      const href = link.href
      if (!href || (!link.dataset.asin && !isClickoutUrl(href))) return

      const contentName = (link.textContent || link.getAttribute('aria-label') || 'Product Click')
        .trim()
        .substring(0, 100)

      analytics.track('CTA Clicked', {
        article_id: id,
        article_slug: slug,
        cta_url: href,
        cta_text: contentName,
        cta_type: link.className,
      })

      window.fbq?.('track', 'Purchase', {
        content_name: contentName,
        content_category: 'Product',
        content_ids: [id],
        content_type: 'product',
      })
    }

    container.addEventListener('click', handleClick)

    return () => {
      container.removeEventListener('click', handleClick)
    }
  }, [id, slug])

  return (
    <div
      ref={containerRef}
      className="public-article-renderer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
