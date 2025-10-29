# 🔗 Martideals URL Redirect System

## Overview

This system automatically transforms product CTA URLs to route through the Martideals partner redirect system with Base64 encoding and dynamic ad_id extraction.

## How It Works

### 1. **URL Transformation Process**

**Original URL:**
```
https://amazon.com/dp/B123456789
```

**Gets transformed to:**
```
https://tracking.martideals.com/partners/url-deep-redirect?url=aHR0cHM6Ly9hbWF6b24uY29tL2RwL0IxMjM0NTY3ODk=&redirectId=123124234234
```

### 2. **Dynamic ad_id Extraction**

When someone visits an article with an `ad_id` parameter:
```
https://daily.get.martideals.com/best-deals-today/index.html?ad_id=123124234234
```

The system automatically:
- ✅ Extracts `ad_id=123124234234` from the URL
- ✅ Maps it to `redirectId=123124234234` in redirect URLs
- ✅ Updates all CTA buttons dynamically

### 3. **Base64 Encoding**

Original URLs are Base64 encoded for security:
- `https://amazon.com/dp/B123456789` → `aHR0cHM6Ly9hbWF6b24uY29tL2RwL0IxMjM0NTY3ODk=`

## Implementation Details

### Server-Side Processing (`lib/url-utils.ts`)

```typescript
// Encodes URL to Base64
encodeUrlToBase64("https://amazon.com/dp/B123456789")
// Returns: "aHR0cHM6Ly9hbWF6b24uY29tL2RwL0IxMjM0NTY3ODk="

// Creates redirect URL
createRedirectUrl("https://amazon.com/dp/B123456789", "123124234234")
// Returns: "https://tracking.martideals.com/partners/url-deep-redirect?url=aHR0cHM6Ly9hbWF6b24uY29tL2RwL0IxMjM0NTY3ODk=&redirectId=123124234234"
```

### Client-Side Processing (JavaScript in articles)

```javascript
// Automatically runs when article loads
document.addEventListener('DOMContentLoaded', function() {
  const adId = extractAdIdFromUrl(window.location.href);
  
  if (adId) {
    // Updates all CTA buttons with current ad_id
    const ctaLinks = document.querySelectorAll('a.btn-primary, a.btn-secondary');
    // ... updates each link dynamically
  }
});
```

## Example Flow

### 1. **Article Creation**
- User enters: `https://amazon.com/dp/B123456789`
- System stores: `https://tracking.martideals.com/partners/url-deep-redirect?url=aHR0cHM6Ly9hbWF6b24uY29tL2RwL0IxMjM0NTY3ODk=&redirectId=default`

### 2. **Article Visit with ad_id**
- User visits: `https://daily.get.martideals.com/best-deals/index.html?ad_id=999888777`
- JavaScript extracts: `ad_id=999888777`
- Updates CTA to: `https://tracking.martideals.com/partners/url-deep-redirect?url=aHR0cHM6Ly9hbWF6b24uY29tL2RwL0IxMjM0NTY3ODk=&redirectId=999888777`

### 3. **Click Tracking**
- User clicks CTA button
- Redirects through: `https://tracking.martideals.com/partners/url-deep-redirect`
- Martideals tracks: `redirectId=999888777`
- User lands on: `https://amazon.com/dp/B123456789`

## Benefits

- ✅ **Dynamic Tracking**: Each visit can have unique ad_id tracking
- ✅ **Secure URLs**: Base64 encoding protects original URLs
- ✅ **Automatic Processing**: No manual URL management needed
- ✅ **Backward Compatible**: Works with existing articles
- ✅ **Real-time Updates**: URLs update instantly based on current page

## Testing

To test the system:

1. **Create an article** with a product URL like `https://amazon.com/dp/B123456789`
2. **Visit the article** with `?ad_id=TEST123` parameter
3. **Check CTA button** - should show redirect URL with `redirectId=TEST123`
4. **Click button** - should route through Martideals redirect system

## URL Structure Reference

```
https://tracking.martideals.com/partners/url-deep-redirect
  ?url={BASE64_ENCODED_ORIGINAL_URL}
  &redirectId={DYNAMIC_AD_ID_FROM_CURRENT_PAGE}
```

This system ensures all product links are properly tracked through the Martideals partner system while maintaining a seamless user experience.
