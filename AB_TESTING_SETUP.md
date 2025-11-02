# A/B Testing System - Quick Setup

## What Was Built

Your MartiCMS now has a complete A/B testing system that allows you to:

✅ **Create A/B tests** for any article with multiple variants  
✅ **Test different elements**: headlines, CTAs, images, layouts, full pages  
✅ **Control traffic distribution**: Manual percentages or auto-pilot mode  
✅ **Track everything with Mixpanel**: Views, conversions, clicks, engagement  
✅ **View real-time analytics**: Performance metrics, statistical significance  
✅ **Auto-optimize**: Automatically shift traffic to winning variants  

## Architecture

### Database Schema (Prisma)
- **ABTest**: Test configurations and settings
- **ABVariant**: Individual variants with performance metrics
- **ABTestEvent**: Event tracking data

### Backend (API Routes)
- `POST /api/ab-tests` - Create new test
- `GET /api/ab-tests?articleId=X` - Get tests for article
- `GET /api/ab-tests/:id` - Get test details
- `PATCH /api/ab-tests/:id` - Update test
- `DELETE /api/ab-tests/:id` - Delete test
- `POST /api/ab-tests/:id/track` - Track events
- `POST /api/ab-tests/:id/optimize` - Trigger optimization

### Frontend Components
- **ABTestManager**: Main test management interface
- **ABTestCreateModal**: 3-step wizard for creating tests
- **ABTestAnalytics**: Real-time analytics dashboard
- **ABTestWrapper**: Client-side variant assignment
- **MixpanelProvider**: Global analytics tracking

### Libraries & Utilities
- **lib/mixpanel.ts**: Mixpanel integration
- **lib/ab-testing.ts**: Core A/B testing logic
- **lib/ab-testing-client.ts**: Client-side script for published articles

## Setup Instructions

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_ab_testing
```

This creates the necessary database tables.

### 2. Verify Mixpanel Configuration

Mixpanel is already configured with your credentials:
- Token: `e474bceac7e0d60bc3c4cb27aaf1d4f7`
- Project ID: `3829444`
- Secret: `166f513b2e6fcbc594e616dd3cd0b573`

### 3. Restart Your Development Server

```bash
npm run dev
```

### 4. Test the System

1. Navigate to any article edit page
2. Scroll down to see "A/B Tests" section
3. Click "Create A/B Test"
4. Follow the 3-step wizard
5. Start your test and view analytics!

## How It Works

### For CMS Users (You)

1. **Create Test**: Define what you want to test
2. **Set Variants**: Create different versions
3. **Distribute Traffic**: Manual or auto-pilot
4. **Monitor**: View real-time analytics
5. **Optimize**: Let system find winner or do it manually
6. **Implement**: Apply winning variant permanently

### For End Users (Your Visitors)

1. User visits article
2. System assigns them to a variant (consistent per session)
3. They see the variant version
4. All interactions tracked to Mixpanel
5. Conversions and clicks recorded
6. Data feeds back to analytics dashboard

### Traffic Distribution

**Manual Mode:**
```
Control: 50%  →  50% of visitors see original
Variant A: 30%  →  30% see version A
Variant B: 20%  →  20% see version B
```

**Auto-Pilot Mode:**
```
Initial: Equal distribution (33% each)
After 100+ views: System analyzes performance
Winner identified: 90% traffic to winner, 10% to others
Continuous optimization as more data comes in
```

## Key Features Explained

### 1. Test Types

**Headline Test:**
- Test different titles and meta titles
- Great for improving click-through rates

**CTA Test:**
- Test button text, colors, positions
- Optimize for conversions

**Image Test:**
- Test different featured images
- Improve visual appeal

**Layout Test:**
- Test grid vs list vs masonry layouts
- Optimize user experience

**Full Page Test:**
- Test completely different content
- Most flexible but requires more setup

### 2. Statistical Significance

The system uses Chi-square testing to determine if results are statistically significant:

- **Minimum**: 30 views per variant
- **Confidence**: 95% (p-value < 0.05)
- **Indicator**: ✓ shows when significant

Example:
```
Control: 1000 views, 50 conversions (5.0%)
Variant: 1000 views, 75 conversions (7.5%) ✓ Significant

Result: Variant is 50% better with 95% confidence!
```

### 3. Auto-Pilot Optimization

Algorithm:
1. Start with equal traffic distribution
2. Collect data until minimum sample size
3. Calculate conversion rates for all variants
4. Test statistical significance vs control
5. Identify best performer
6. Shift 90% traffic to winner
7. Keep 10% for exploration
8. Re-evaluate periodically

### 4. Mixpanel Tracking

**Automatic Events:**
- Variant Viewed (when user sees variant)
- Article Viewed (page load)
- Article Click (CTA and product clicks)
- Page View (all CMS pages)

**Custom Events:**
You can add custom tracking:
```javascript
window.abTestTrackConversion('purchase', { amount: 99.99 });
window.abTestTrackClick('custom_button', { location: 'header' });
```

## File Structure

```
martiCMS/
├── prisma/
│   └── schema.prisma (updated with AB testing models)
├── lib/
│   ├── mixpanel.ts (Mixpanel integration)
│   ├── ab-testing.ts (core logic)
│   ├── ab-testing-client.ts (client script)
│   └── template.ts (updated with AB script injection)
├── components/
│   ├── ABTestManager.tsx (main UI)
│   ├── ABTestCreateModal.tsx (creation wizard)
│   ├── ABTestAnalytics.tsx (analytics dashboard)
│   ├── ABTestWrapper.tsx (client wrapper)
│   └── MixpanelProvider.tsx (global tracking)
├── app/
│   ├── api/
│   │   └── ab-tests/
│   │       ├── route.ts (list/create)
│   │       └── [id]/
│   │           ├── route.ts (get/update/delete)
│   │           ├── track/route.ts (event tracking)
│   │           └── optimize/route.ts (optimization)
│   ├── articles/[id]/page.tsx (updated with AB manager)
│   └── layout.tsx (updated with Mixpanel provider)
└── AB_TESTING_GUIDE.md (comprehensive guide)
```

## Testing Checklist

- [ ] Database migration completed
- [ ] Development server restarted
- [ ] Can access article edit page
- [ ] Can see "A/B Tests" section
- [ ] Can create new test
- [ ] Can start test
- [ ] Can view analytics
- [ ] Published article shows variant
- [ ] Mixpanel receives events
- [ ] Auto-pilot optimization works

## Common Use Cases

### 1. E-commerce Product Page
**Test**: CTA button text
- Control: "Add to Cart"
- Variant A: "Buy Now"
- Variant B: "Get It Now"
- **Goal**: Increase add-to-cart rate

### 2. Blog Article
**Test**: Headline
- Control: "10 Tips for Better Sleep"
- Variant A: "Sleep Better Tonight: 10 Proven Tips"
- Variant B: "Can't Sleep? Try These 10 Simple Tricks"
- **Goal**: Increase click-through rate

### 3. Landing Page
**Test**: Layout
- Control: List layout
- Variant A: Grid layout
- Variant B: Masonry layout
- **Goal**: Increase time on page

### 4. Call-to-Action
**Test**: Button color and position
- Control: Blue button at bottom
- Variant A: Red button at bottom
- Variant B: Green button at top
- **Goal**: Increase conversions

## Monitoring & Maintenance

### Daily
- Check running tests in dashboard
- Review Mixpanel for anomalies

### Weekly
- Review test performance
- Check for statistical significance
- Adjust traffic if needed

### Monthly
- Complete successful tests
- Implement winning variants
- Start new tests

## Troubleshooting

### Issue: Test not showing in analytics
**Solution**: Verify test status is "running" and article is published

### Issue: No traffic distribution
**Solution**: Check traffic percentages sum to 100%

### Issue: Mixpanel not tracking
**Solution**: Check browser console, verify token is correct

### Issue: Auto-pilot not optimizing
**Solution**: Ensure minimum sample size is reached

## Next Steps

1. **Read the full guide**: See `AB_TESTING_GUIDE.md`
2. **Create your first test**: Start with a simple headline test
3. **Monitor results**: Check analytics daily
4. **Iterate**: Keep testing and optimizing!

## Support Resources

- **Full Documentation**: `AB_TESTING_GUIDE.md`
- **Mixpanel Dashboard**: https://mixpanel.com/project/3829444
- **API Reference**: See guide for detailed API docs

---

**Ready to start testing?** Navigate to any article and scroll to the A/B Tests section! 🚀

