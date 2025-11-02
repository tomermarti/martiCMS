# A/B Testing System - Complete Guide

## Overview

MartiCMS now includes a powerful A/B testing system that allows you to optimize your content performance through data-driven experimentation. The system integrates with Mixpanel for analytics and supports both manual traffic distribution and auto-pilot optimization.

## Features

### 🎯 Core Capabilities

- **Multiple Test Types**: Test headlines, CTAs, images, layouts, or full page content
- **Traffic Distribution**: Manual percentage control or auto-pilot optimization
- **Real-time Analytics**: Live performance metrics and statistical significance
- **Mixpanel Integration**: Comprehensive event tracking and user analytics
- **Auto-optimization**: Automatically shift traffic to winning variants
- **Statistical Significance**: Chi-square testing with confidence levels

### 📊 What You Can Test

1. **Headlines/Titles** - Test different article titles and meta titles
2. **Call-to-Actions (CTAs)** - Test button text, colors, and positions
3. **Featured Images** - Test different hero images
4. **Page Layouts** - Test grid, list, masonry, or full-width layouts
5. **Full Page Content** - Test completely different content versions

## Getting Started

### Prerequisites

- MartiCMS installed and running
- PostgreSQL database
- Mixpanel account (credentials already configured)

### Database Migration

Run the database migration to create A/B testing tables:

```bash
npx prisma migrate dev --name add_ab_testing
```

This creates the following tables:
- `ABTest` - Test configurations
- `ABVariant` - Test variants with performance metrics
- `ABTestEvent` - Event tracking data

## Creating Your First A/B Test

### Step 1: Navigate to Article Editor

1. Go to your article edit page
2. Scroll down to the "A/B Tests" section
3. Click "Create A/B Test"

### Step 2: Configure Test Settings

**Test Configuration:**
- **Name**: Give your test a descriptive name (e.g., "Headline Test - Q4 2025")
- **Description**: Optional notes about what you're testing
- **Test Type**: Choose what element you're testing
- **Distribution Mode**: 
  - **Manual**: Set traffic percentages yourself
  - **Auto-Pilot**: Let the system optimize automatically

**Auto-Pilot Settings (if selected):**
- **Optimization Goal**: What metric to optimize for
  - Conversions (default)
  - Engagement
  - Click-through rate
  - Time on page
- **Minimum Sample Size**: Views needed before optimization (default: 100)

### Step 3: Define Variants

**Control Variant:**
- Always required
- Represents your current/original version
- Automatically uses existing article content

**Test Variants:**
- Add 1 or more variants (A, B, C, etc.)
- Define what's different for each variant
- Changes depend on test type:

**Example - Headline Test:**
```
Control: "10 Best Deals This Week"
Variant A: "Save Big: Top 10 Deals You Can't Miss"
Variant B: "Exclusive Deals: 10 Products Under $50"
```

**Example - CTA Test:**
```
Control: "Shop Now" (Blue button, Bottom)
Variant A: "Buy Now" (Red button, Bottom)
Variant B: "Get Deal" (Green button, Top)
```

### Step 4: Set Traffic Distribution

**Manual Mode:**
- Use sliders to set percentage for each variant
- Must total 100%
- Example: Control 50%, Variant A 30%, Variant B 20%

**Auto-Pilot Mode:**
- Starts with equal distribution
- After minimum sample size is reached:
  - System identifies best performer
  - Shifts 90% traffic to winner
  - Keeps 10% for other variants

### Step 5: Start Your Test

1. Review all settings
2. Click "Create Test"
3. Test is created in "Draft" status
4. Click "Start Test" to begin
5. Test goes live immediately

## Monitoring Test Performance

### Real-Time Analytics Dashboard

Click "📊 View Analytics" on any test to see:

**Summary Metrics:**
- Total views across all variants
- Total conversions
- Overall conversion rate
- Current best performer with improvement %

**Variant Performance Table:**
- Traffic percentage
- Views and conversions
- Conversion rate with improvement vs control
- Click-through rate
- Statistical significance indicator

**Visual Chart:**
- Bar chart comparing conversion rates
- Winner highlighted in green
- Statistically significant variants marked with ✓

### Understanding Statistical Significance

**What it means:**
- ✓ Significant: Results are reliable (95% confidence)
- "Not yet": Need more data for reliable results

**Requirements:**
- Minimum 30 views per variant
- P-value < 0.05 (95% confidence level)

**Example:**
```
Control: 100 views, 10 conversions (10% rate)
Variant A: 100 views, 15 conversions (15% rate) ✓ Significant
Variant B: 100 views, 11 conversions (11% rate) - Not significant
```

Result: Variant A is a clear winner with 50% improvement!

## Auto-Pilot Optimization

### How It Works

1. **Equal Start**: All variants get equal traffic initially
2. **Data Collection**: System collects views and conversions
3. **Analysis**: After minimum sample size:
   - Calculates conversion rates
   - Tests statistical significance
   - Identifies best performer
4. **Optimization**: Shifts traffic to winner (90/10 split)
5. **Continuous**: Re-evaluates as more data comes in

### Optimization Goals

**Conversions (Recommended):**
- Optimizes for highest conversion rate
- Best for e-commerce and lead generation

**Engagement:**
- Optimizes for click-through rate
- Best for content discovery

**Time on Page:**
- Optimizes for longest session duration
- Best for content quality

**Click-Through:**
- Optimizes for link clicks
- Best for traffic generation

### Manual Optimization

You can also manually trigger optimization:
1. Click "Optimize Now" on running test
2. System immediately analyzes and redistributes traffic

## Test Management

### Test Statuses

- **Draft**: Test created but not started
- **Running**: Test is live and collecting data
- **Paused**: Test temporarily stopped (can resume)
- **Completed**: Test finished, winner declared

### Actions Available

**Draft Tests:**
- Start Test
- Delete Test

**Running Tests:**
- Pause Test
- Optimize Now (auto-pilot only)
- Complete Test
- View Analytics

**Paused Tests:**
- Resume Test
- Complete Test
- Delete Test

**Completed Tests:**
- View Analytics (read-only)
- Delete Test

## Mixpanel Integration

### Events Tracked

**Variant Viewed:**
- Fired when user sees a variant
- Properties: test_id, variant_id, variant_name, traffic_percent, device_type

**Article Viewed:**
- Fired on article page load
- Properties: article_id, article_slug, test_id, variant_id

**Conversion:**
- Fired when user converts (clicks CTA, makes purchase, etc.)
- Properties: test_id, variant_id, conversion_type

**Article Click:**
- Fired when user clicks important elements
- Properties: article_id, click_target, test_id, variant_id

**Page View:**
- Fired on all CMS page views
- Properties: path, referrer

### Custom Conversion Tracking

Add custom conversion tracking to your articles:

```javascript
// Track when user clicks "Buy Now" button
document.querySelector('.buy-button').addEventListener('click', function() {
  window.abTestTrackConversion('purchase_intent', {
    product_id: '12345',
    price: 29.99
  });
});

// Track form submission
document.querySelector('#signup-form').addEventListener('submit', function() {
  window.abTestTrackConversion('signup', {
    form_type: 'newsletter'
  });
});
```

### Viewing Data in Mixpanel

1. Log into your Mixpanel dashboard
2. Navigate to "Insights" or "Funnels"
3. Filter by test_id or variant_id
4. Analyze user behavior and conversion paths

## Best Practices

### Test Design

✅ **DO:**
- Test one thing at a time (headline OR image, not both)
- Run tests for at least 1-2 weeks
- Wait for statistical significance
- Test meaningful differences (not minor tweaks)
- Document your hypotheses

❌ **DON'T:**
- Stop tests too early
- Test too many variants (2-3 is ideal)
- Make changes during active tests
- Ignore statistical significance
- Test during unusual traffic periods

### Traffic Distribution

**Manual Mode - When to Use:**
- You want full control
- Testing risky changes (start with 10% traffic)
- Limited traffic (focus on fewer variants)

**Auto-Pilot - When to Use:**
- You want hands-off optimization
- High traffic volume
- Long-running tests
- Multiple variants to test

### Sample Size Guidelines

**Minimum Recommended:**
- 100 views per variant for basic tests
- 1,000 views per variant for reliable results
- 10,000+ views for high-confidence decisions

**Time Considerations:**
- Run tests for full weeks (account for weekday/weekend differences)
- Avoid holiday periods unless specifically testing for them
- Allow 2-4 weeks for statistical significance

## API Reference

### Create A/B Test

```
POST /api/ab-tests
```

**Body:**
```json
{
  "name": "Headline Test",
  "description": "Testing different headlines",
  "articleId": "article_id",
  "testType": "headline",
  "distributionMode": "manual",
  "variants": [
    {
      "name": "Control",
      "trafficPercent": 50,
      "isControl": true,
      "changes": {}
    },
    {
      "name": "Variant A",
      "trafficPercent": 50,
      "isControl": false,
      "changes": {
        "title": "New Headline"
      }
    }
  ]
}
```

### Get Test Details

```
GET /api/ab-tests/{testId}
```

### Update Test

```
PATCH /api/ab-tests/{testId}
```

**Body:**
```json
{
  "status": "running",
  "distributionMode": "auto_pilot"
}
```

### Track Event

```
POST /api/ab-tests/{testId}/track
```

**Body:**
```json
{
  "eventType": "conversion",
  "variantId": "variant_id",
  "sessionId": "session_id",
  "eventData": {
    "conversionType": "purchase"
  }
}
```

### Trigger Optimization

```
POST /api/ab-tests/{testId}/optimize
```

## Troubleshooting

### Test Not Showing Changes

**Problem:** Variant changes not appearing on published article

**Solutions:**
1. Verify test status is "running"
2. Check traffic percentage > 0%
3. Clear browser cache/localStorage
4. Verify article is published
5. Check browser console for errors

### No Data in Analytics

**Problem:** Analytics dashboard shows zero views

**Solutions:**
1. Verify test is running
2. Check article is getting traffic
3. Verify Mixpanel token is correct
4. Check browser console for tracking errors
5. Test in incognito mode (avoid ad blockers)

### Statistical Significance Not Showing

**Problem:** Variants show "Not yet" for significance

**Solutions:**
1. Wait for more traffic (minimum 30 views per variant)
2. Ensure variants have different performance
3. Check if difference is too small to detect
4. Consider running test longer

### Auto-Pilot Not Optimizing

**Problem:** Traffic distribution not changing in auto-pilot

**Solutions:**
1. Verify minimum sample size reached
2. Check if any variant is statistically significant
3. Manually trigger optimization
4. Review optimization goal matches your metrics

## Advanced Features

### Custom Test Types

For advanced users, you can create custom test types by modifying variant changes:

```json
{
  "changes": {
    "title": "Custom Title",
    "featuredImage": "https://example.com/image.jpg",
    "layout": "grid",
    "ctaText": "Custom CTA",
    "ctaColor": "#FF0000",
    "customCSS": ".article { background: blue; }"
  }
}
```

### Scheduled Tests

Tests can be scheduled by setting start/end dates:

```javascript
{
  "startDate": "2025-11-01T00:00:00Z",
  "endDate": "2025-11-30T23:59:59Z"
}
```

### Multi-variate Testing

Test multiple elements simultaneously by combining changes:

```json
{
  "changes": {
    "title": "New Headline",
    "featuredImage": "new-image.jpg",
    "ctaText": "Buy Now",
    "ctaColor": "#FF0000"
  }
}
```

## Support

For issues or questions:
1. Check this documentation
2. Review Mixpanel dashboard for tracking issues
3. Check browser console for JavaScript errors
4. Review database logs for API errors

## Mixpanel Credentials

- **Token**: e474bceac7e0d60bc3c4cb27aaf1d4f7
- **Project ID**: 3829444
- **Secret**: 166f513b2e6fcbc594e616dd3cd0b573

## Next Steps

1. ✅ Create your first A/B test
2. ✅ Let it run for 1-2 weeks
3. ✅ Review analytics dashboard
4. ✅ Implement winning variant
5. ✅ Start next test!

Happy testing! 🚀

