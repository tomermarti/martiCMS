# Mixpanel Tracking Setup for Articles

## Overview
Comprehensive Mixpanel tracking has been implemented for all published articles to track user behavior, engagement, and A/B test performance.

## What Gets Tracked

### 1. **Article Page Views** 
Automatically tracked when a user lands on any article page.

**Event Name:** `Article Page View`

**Properties tracked:**
- `article_id` - Unique article identifier
- `article_slug` - URL slug of the article
- `article_title` - Title of the article
- `author` - Article author name
- `page_url` - Full URL of the page
- `page_path` - Path portion of the URL
- `referrer` - Where the user came from
- All UTM parameters (utm_source, utm_medium, utm_campaign, etc.)
- All custom URL parameters
- `device_type` - mobile/tablet/desktop
- `timestamp` - ISO timestamp

### 2. **CTA Clicks**
Tracks when users click on Call-to-Action buttons.

**Event Name:** `CTA Clicked`

**Properties tracked:**
- All Article Page View properties
- `cta_url` - Destination URL of the CTA
- `cta_text` - Button text
- `cta_type` - CSS class of the button
- A/B test context (test_id, test_name, variant_id, variant_name) if active

### 3. **A/B Test Variant Views**
Automatically tracked when a user is assigned to an A/B test variant.

**Event Name:** `Variant Viewed`

**Properties tracked:**
- All Article Page View properties
- `test_id` - A/B test identifier
- `test_name` - Name of the A/B test
- `variant_id` - Variant identifier
- `variant_name` - Name of the variant
- `is_control` - Boolean, whether this is the control variant
- `traffic_percent` - Traffic allocation percentage
- `template_id` - Template used for this variant

### 4. **Conversions**
Tracked via the global function `abTestTrackConversion()`.

**Event Name:** `Conversion`

**Properties tracked:**
- All Article Page View properties
- All A/B test context properties
- `conversion_type` - Type of conversion (customizable)
- Any additional custom event data

### 5. **Scroll Depth**
Tracks how far users scroll through the article content.

**Event Name:** `Scroll Depth`

**Properties tracked:**
- All Article Page View properties
- `scroll_depth` - Percentage milestone (25%, 50%, 75%, 100%)
- A/B test context if active

## Implementation Details

### Mixpanel Initialization
The official Mixpanel snippet is embedded in every published article HTML. It includes:
- Stub methods that queue events before the library loads
- Asynchronous loading for performance
- Automatic initialization with token: `e474bceac7e0d60bc3c4cb27aaf1d4f7`

### URL Parameter Tracking
**All URL parameters are automatically captured**, including:
- UTM parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term)
- Custom parameters (ad_id, campaign_id, etc.)
- Hash parameters
- Referrer information

### A/B Test Integration
When an A/B test is active:
- Test and variant information is automatically added to all events
- Variant assignment is tracked immediately
- All subsequent events include the A/B test context

### Backup Tracking
All events are also stored in `localStorage` under the key `ab_test_events` (last 100 events) for debugging purposes.

## Console Logging

All tracking events generate console logs for debugging:
- ✅ **Success messages** - When events are successfully sent to Mixpanel
- ⚠️ **Warning messages** - When Mixpanel isn't available yet
- ❌ **Error messages** - When tracking fails
- 📊 **Event details** - Full event data for each tracking call

## How to Use

### Track Custom Conversions
```javascript
// Track a conversion with default type
window.abTestTrackConversion('button_click');

// Track with custom data
window.abTestTrackConversion('purchase', {
  product_id: '123',
  price: 29.99,
  currency: 'USD'
});
```

### Debug Tracking
Open browser console and check:
1. Look for Mixpanel initialization message: `✅ Mixpanel initialized successfully`
2. Look for page view tracking: `📊 Article page view tracked`
3. Check localStorage: `localStorage.getItem('ab_test_events')`

### View Events in Mixpanel
1. Log into Mixpanel dashboard
2. Go to "Events" section
3. Filter by event name:
   - `Article Page View`
   - `CTA Clicked`
   - `Variant Viewed`
   - `Conversion`
   - `Scroll Depth`

## Key Features

### ✅ No Initialization Errors
- Uses official Mixpanel snippet with stub methods
- Events are queued before library loads
- No "mixpanel object not initialized" errors

### ✅ Complete Context
- Every event includes full URL parameters
- Referrer tracking
- Device type detection
- Timestamp in ISO format

### ✅ A/B Test Integration
- Automatic variant assignment tracking
- All events include test context
- Session-based variant persistence

### ✅ Performance Optimized
- Asynchronous script loading
- Non-blocking initialization
- Throttled scroll tracking (500ms debounce)

### ✅ Privacy Compliant
- Respects Do Not Track (DNT) settings
- Works with cookie consent banner
- Data stored in localStorage only

## Files Modified

1. **lib/template.ts** - Main article template with Mixpanel integration
   - Lines 916-948: Mixpanel initialization
   - Lines 180-208: Enhanced trackEvent function
   - Lines 649-682: CTA click tracking
   - Lines 751-809: Scroll depth tracking

2. **lib/mixpanel.ts** - CMS-side Mixpanel utilities (not used in articles)
   - Enhanced with initialization checks
   - Used only for CMS admin interface

## Testing Checklist

- [ ] Open a published article in browser
- [ ] Open browser console
- [ ] Verify "✅ Mixpanel initialized successfully" appears
- [ ] Verify "📊 Article page view tracked" appears
- [ ] Click a CTA button, verify "📊 CTA click tracked" in console
- [ ] Scroll down, verify scroll depth tracking at 25%, 50%, 75%, 100%
- [ ] Check Mixpanel dashboard for events
- [ ] Test with UTM parameters in URL
- [ ] Test with A/B test active

## Next Steps

1. **Republish articles** to apply the new tracking
2. **Monitor console** for tracking confirmation
3. **Check Mixpanel dashboard** for incoming events
4. **Set up funnels** in Mixpanel to analyze user journeys
5. **Create cohorts** based on A/B test variants
6. **Build dashboards** for key metrics

## Troubleshooting

### Events not appearing in Mixpanel?
- Check browser console for error messages
- Verify network tab shows requests to `api.mixpanel.com`
- Ensure article was republished after these changes
- Check if ad blockers are interfering

### Mixpanel initialization errors?
- Clear browser cache and reload
- Check if script is loading from CDN
- Verify token is correct: `e474bceac7e0d60bc3c4cb27aaf1d4f7`

### Missing URL parameters?
- Parameters are captured on page load
- Verify parameters are in the URL
- Check console logs for tracking data

## Support

For issues or questions:
1. Check browser console logs
2. Review `localStorage.getItem('ab_test_events')`
3. Verify article was republished after changes
4. Test in incognito mode to rule out caching

