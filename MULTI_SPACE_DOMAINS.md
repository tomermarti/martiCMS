# Multi-Space Dynamic Domains Implementation

## Overview

The system has been updated to support dynamic domains and upload layout files to both spaces:
- **daily**: MartiDeals (daily.get.martideals.com)
- **heymarti**: HeyMarti (files.cdn.heymarti.com)

## Changes Made

### 1. Updated Spaces Configuration (`lib/spaces.ts`)

Added support for multiple spaces with domain-specific configurations:

```typescript
const SPACES_CONFIG = {
  daily: {
    bucket: 'deals',
    domain: 'daily.get.martideals.com',
    brandName: 'MartiDeals'
  },
  heymarti: {
    bucket: 'heymarti',
    domain: 'files.cdn.heymarti.com',
    brandName: 'HeyMarti'
  }
}
```

### 2. New Functions Added

- `replaceDomainPlaceholders()`: Replaces domain placeholders with space-specific values
- `uploadFileToSpace()`: Uploads to a specific space
- `uploadLayoutFileToBothSpaces()`: Uploads to both spaces with domain-specific content

### 3. HTML Files Made Dynamic

All HTML files now use placeholders:
- `{{DOMAIN}}` → replaced with space-specific domain
- `{{BRAND_NAME}}` → replaced with space-specific brand name

**Files Updated:**
- `public/header.html`
- `public/footer.html`
- `public/privacy-policy.html`
- `public/ccpa-privacy-rights.html`
- `public/do-not-sell.html`
- `public/terms-of-service.html`

### 4. Layout API Routes Updated

All layout API routes now upload to both spaces:
- `/api/layout/header`
- `/api/layout/footer`
- `/api/layout/privacy-policy`
- `/api/layout/ccpa-privacy-rights`
- `/api/layout/do-not-sell`
- `/api/layout/terms-of-service`

## Environment Variables Required

Your existing environment configuration should work:

```env
# Existing variables (no changes needed)
DO_SPACES_KEY=your_key
DO_SPACES_SECRET=your_secret
DO_SPACES_BUCKET=deals  # Used for backward compatibility
DO_SPACES_REGION=nyc3
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

**Note**: The system now uses hardcoded bucket names:
- **deals** bucket for MartiDeals (daily.get.martideals.com)
- **heymarti** bucket for HeyMarti (files.cdn.heymarti.com)

## How It Works

### 1. Domain Replacement Process

When uploading layout files, the system:
1. Takes the template content with placeholders
2. For each space (daily, heymarti):
   - Replaces `{{DOMAIN}}` with the space's domain
   - Replaces `{{BRAND_NAME}}` with the space's brand name
   - Uploads the customized content to that space

### 2. Example Transformation

**Template Content:**
```html
<title>Privacy Policy - {{BRAND_NAME}}</title>
<a href="https://{{DOMAIN}}/assets/privacy-policy.html">Privacy Policy</a>
```

**For daily space:**
```html
<title>Privacy Policy - MartiDeals</title>
<a href="https://daily.get.martideals.com/assets/privacy-policy.html">Privacy Policy</a>
```

**For heymarti space:**
```html
<title>Privacy Policy - HeyMarti</title>
<a href="https://files.cdn.heymarti.com/assets/privacy-policy.html">Privacy Policy</a>
```

## API Response Format

Layout API endpoints now return information for both spaces:

```json
{
  "message": "Header updated successfully on both spaces with cache purging",
  "results": [
    {
      "space": "daily",
      "url": "https://daily.get.martideals.com/assets/header.html",
      "versionedUrl": "https://daily.get.martideals.com/assets/header-1699123456789.html",
      "domain": "daily.get.martideals.com"
    },
    {
      "space": "heymarti", 
      "url": "https://files.cdn.heymarti.com/assets/header.html",
      "versionedUrl": "https://files.cdn.heymarti.com/assets/header-1699123456789.html",
      "domain": "files.cdn.heymarti.com"
    }
  ],
  "timestamp": 1699123456789,
  "lastUpdated": "2024-11-04T...",
  "cachePurged": true
}
```

## Usage

### Updating Layout Files

When you update any layout file through the CMS interface or API, it will automatically:
1. Upload to both spaces
2. Create domain-specific versions
3. Apply cache purging
4. Update version tracking

### Accessing Files

**MartiDeals (daily space):**
- Header: `https://daily.get.martideals.com/assets/header.html`
- Footer: `https://daily.get.martideals.com/assets/footer.html`
- Privacy: `https://daily.get.martideals.com/assets/privacy-policy.html`

**HeyMarti (heymarti space):**
- Header: `https://files.cdn.heymarti.com/assets/header.html`
- Footer: `https://files.cdn.heymarti.com/assets/footer.html`
- Privacy: `https://files.cdn.heymarti.com/assets/privacy-policy.html`

## Benefits

1. **Automatic Dual Upload**: All layout changes are automatically applied to both spaces
2. **Brand Consistency**: Each space gets the correct branding and domain references
3. **Cache Management**: Aggressive cache purging ensures immediate updates
4. **Version Tracking**: Timestamped versions for immediate access during cache propagation
5. **Backward Compatibility**: Existing functionality remains unchanged

## Testing

To verify the implementation:

1. Update a layout file through the CMS
2. Check both domains to ensure files are uploaded
3. Verify domain-specific content is correct
4. Confirm cache purging is working

## Troubleshooting

If files aren't uploading to both spaces:
1. Check `DO_SPACES_BUCKET_HEYMARTI` environment variable
2. Verify both buckets exist and are accessible
3. Check console logs for upload errors
4. Ensure both spaces have proper CORS configuration
