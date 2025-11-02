# 📊 Facebook Pixel Implementation - MartiCMS

## Overview

Facebook Pixel (ID: **2034568930646321**) has been successfully implemented across all articles in the MartiCMS system with automatic **Purchase event tracking** for Amazon clickouts.

## ✅ What Was Implemented

### 1. **Universal Facebook Pixel Installation**
- **Pixel ID**: `2034568930646321` is now automatically loaded on all articles
- **Fallback System**: If an article has a custom `facebookPixel` field, it uses that; otherwise defaults to `2034568930646321`
- **Standard Events**: Automatic `PageView` tracking on all article pages

### 2. **Purchase Event Tracking for Amazon Clickouts**
- **Automatic Detection**: System automatically detects Amazon links and redirects
- **Purchase Event**: Fires Facebook Pixel `Purchase` event when users click Amazon links
- **Link Types Detected**:
  - Direct Amazon links (`amazon.com`, `amzn.to`)
  - MartiDeals redirect system (`martideals.com/partners/url-deep-redirect`)

### 3. **Enhanced Event Tracking**
- **CTA Clicks**: All CTA button clicks are tracked with Facebook Pixel
- **A/B Test Conversions**: A/B test conversions also fire Purchase events
- **Engagement Tracking**: Non-Amazon clicks fire `InitiateCheckout` events

## 🔧 Technical Implementation

### File Modified: `lib/template.ts`

#### Facebook Pixel Installation (Lines 108-123)
```javascript
<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${article.facebookPixel || '2034568930646321'}');
  fbq('track', 'PageView');
</script>
```

#### Purchase Event Tracking (Lines 806-839)
```javascript
// Track Facebook Pixel Purchase Event for Amazon clickouts
if (typeof fbq !== 'undefined') {
  try {
    // Check if this is an Amazon link or redirect to Amazon
    const isAmazonLink = url && (
      url.includes('amazon.com') || 
      url.includes('amzn.to') ||
      url.includes('martideals.com/partners/url-deep-redirect')
    );
    
    if (isAmazonLink) {
      fbq('track', 'Purchase', {
        content_name: eventData.cta_text || 'Product Click',
        content_category: 'Product',
        content_ids: [eventData.article_id || 'unknown'],
        content_type: 'product',
        value: 1.00,
        currency: 'USD'
      });
    }
  } catch (error) {
    console.error('❌ Facebook Pixel tracking failed:', error);
  }
}
```

## 📈 Event Types Tracked

### 1. **PageView Events**
- **When**: Every article page load
- **Data**: Standard Facebook Pixel PageView event

### 2. **Purchase Events** 
- **When**: User clicks Amazon links or redirects
- **Data**:
  - `content_name`: CTA button text
  - `content_category`: "Product"
  - `content_ids`: Article ID
  - `content_type`: "product"
  - `value`: 1.00 USD (default)

### 3. **InitiateCheckout Events**
- **When**: User clicks non-Amazon CTA buttons
- **Data**:
  - `content_name`: CTA button text
  - `content_category`: "Engagement"

### 4. **A/B Test Conversion Events**
- **When**: A/B test conversion is tracked
- **Data**: Same as Purchase events but with A/B test context

## 🧪 Testing

### Test File Created: `test-fb-pixel.html`
A comprehensive test page has been created to verify Facebook Pixel implementation:

- **Test Amazon Purchase Events**
- **Test General CTA Clicks** 
- **Test A/B Test Conversions**
- **Real-time Event Logging**
- **Network Request Monitoring**

### How to Test:
1. Open `test-fb-pixel.html` in a browser
2. Open browser Developer Tools → Network tab
3. Filter by "facebook" or "tr" to see pixel requests
4. Click test buttons and verify events fire

## 🔍 Verification

### In Browser Developer Tools:
1. **Console Logs**: Look for Facebook Pixel success messages
2. **Network Tab**: Check for requests to `facebook.com/tr`
3. **Facebook Pixel Helper**: Use Chrome extension to verify events

### Expected Console Messages:
```
✅ Facebook Pixel Purchase event fired for Amazon clickout
✅ Facebook Pixel InitiateCheckout event fired for CTA click
✅ Facebook Pixel Purchase event fired for AB test conversion
```

## 🚀 Deployment Status

- ✅ **Facebook Pixel Installed**: All articles now have Pixel ID 2034568930646321
- ✅ **Purchase Events**: Amazon clickouts trigger Purchase events
- ✅ **Backward Compatible**: Existing custom pixel IDs still work
- ✅ **A/B Test Integration**: A/B test conversions tracked
- ✅ **Error Handling**: Graceful fallbacks if pixel fails to load

## 📊 Expected Results

With this implementation, you should see in Facebook Ads Manager:
- **PageView events** from all article visitors
- **Purchase events** when users click to Amazon products
- **InitiateCheckout events** for other engagement actions
- **Conversion tracking** for A/B test optimization

The Purchase events will be the same as Amazon clickouts, providing accurate conversion data for Facebook advertising campaigns.
