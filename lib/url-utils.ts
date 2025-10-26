/**
 * URL utilities for handling CTA redirects through Martideals partner system
 */

/**
 * Encodes a URL to Base64 for use in redirect system
 * @param url - The original URL to encode
 * @returns Base64 encoded URL
 */
export function encodeUrlToBase64(url: string): string {
  // Ensure URL is properly formatted
  const cleanUrl = url.trim()
  
  // Convert to Base64
  return Buffer.from(cleanUrl, 'utf-8').toString('base64')
}

/**
 * Extracts ad_id from the current article URL
 * Expected format: https://daily.get.martideals.com/article-slug/index.html?ad_id=123124234234
 * @param currentUrl - The current article URL
 * @returns The ad_id value or null if not found
 */
export function extractAdIdFromUrl(currentUrl: string): string | null {
  try {
    const url = new URL(currentUrl)
    return url.searchParams.get('ad_id')
  } catch (error) {
    console.warn('Failed to parse URL for ad_id extraction:', currentUrl)
    return null
  }
}

/**
 * Creates a Martideals redirect URL with Base64 encoded original URL
 * @param originalUrl - The original CTA URL (e.g., Amazon product link)
 * @param adId - The ad ID from the current article URL
 * @returns Formatted redirect URL through Martideals partner system
 */
export function createRedirectUrl(originalUrl: string, adId: string | null): string {
  // If no adId provided, use a default or generate one
  const redirectId = adId || 'default'
  
  // Encode the original URL to Base64
  const encodedUrl = encodeUrlToBase64(originalUrl)
  
  // Construct the redirect URL
  return `https://www.martideals.com/partners/url-deep-redirect?url=${encodedUrl}&redirectId=${redirectId}`
}

/**
 * Processes a CTA URL for use in articles
 * This function handles the complete transformation from original URL to redirect URL
 * @param originalUrl - The original CTA URL
 * @param currentArticleUrl - The current article URL (to extract ad_id)
 * @returns Processed redirect URL
 */
export function processCTAUrl(originalUrl: string, currentArticleUrl?: string): string {
  // If no original URL provided, return empty string
  if (!originalUrl || !originalUrl.trim()) {
    return ''
  }
  
  // Extract ad_id from current article URL if provided
  let adId: string | null = null
  if (currentArticleUrl) {
    adId = extractAdIdFromUrl(currentArticleUrl)
  }
  
  // If we're in a browser environment, try to get ad_id from current page URL
  if (!adId && typeof window !== 'undefined') {
    adId = extractAdIdFromUrl(window.location.href)
  }
  
  // Create and return the redirect URL
  return createRedirectUrl(originalUrl, adId)
}

/**
 * Client-side function to get ad_id from current page
 * @returns The ad_id from current page URL or null
 */
export function getCurrentAdId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  return extractAdIdFromUrl(window.location.href)
}
