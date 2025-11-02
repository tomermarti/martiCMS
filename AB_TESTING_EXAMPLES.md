# A/B Testing - Step-by-Step Examples & Instructions

## 🎯 Where to Set Up A/B Tests

### Location in CMS
1. **Navigate to Article Editor**: Go to `/articles/[article-id]`
2. **Scroll to Bottom**: Find "A/B Tests" section below the article form
3. **Click "Create A/B Test"**: Opens the 3-step wizard

### The 3-Step Wizard

#### Step 1: Configuration
- **Test Name**: Descriptive name (e.g., "Holiday CTA Test")
- **Test Type**: Choose what you're testing
- **Distribution Mode**: Manual or Auto-pilot

#### Step 2: Variants
- **Define Control**: Your current version (automatically uses existing content)
- **Add Variants**: Different versions to test
- **Set Changes**: JSON structure varies by test type

#### Step 3: Traffic
- **Set Percentages**: How much traffic each variant gets
- **Must total 100%**

---

## 📝 Test Type Examples & JSON Changes

### 1. HEADLINE TEST

**What it tests**: Different titles and meta titles  
**Best for**: Improving click-through rates, SEO

**Example Scenario**: Testing product page headlines

```json
// Control (Original)
{} // Empty - uses existing article title

// Variant A - Benefit-focused
{
  "title": "Save 50% on Premium Headphones - Limited Time",
  "metaTitle": "Premium Headphones Sale - 50% Off Today Only"
}

// Variant B - Urgency-focused  
{
  "title": "Only 24 Hours Left: Premium Headphones Sale",
  "metaTitle": "Last Chance: Premium Headphones 50% Off"
}

// Variant C - Feature-focused
{
  "title": "Noise-Canceling Headphones with 30-Hour Battery",
  "metaTitle": "Best Noise-Canceling Headphones - 30Hr Battery Life"
}
```

**Where to set in UI**:
1. Select "Headline / Title" as test type
2. In Step 2, for each variant:
   - **Title field**: Enter new headline
   - **Meta Title field**: Enter SEO title

---

### 2. CTA (CALL-TO-ACTION) TEST

**What it tests**: Button text, colors, and positions  
**Best for**: Improving conversion rates

**Example Scenario**: Testing e-commerce buy buttons

```json
// Control (Original)
{} // Uses existing CTA

// Variant A - Action-focused
{
  "ctaText": "Buy Now",
  "ctaColor": "#FF0000",
  "ctaPosition": "top"
}

// Variant B - Benefit-focused
{
  "ctaText": "Get 50% Off",
  "ctaColor": "#00AA00", 
  "ctaPosition": "bottom"
}

// Variant C - Urgency-focused
{
  "ctaText": "Claim Deal Now",
  "ctaColor": "#FF6600",
  "ctaPosition": "middle"
}
```

**Where to set in UI**:
1. Select "Call-to-Action (CTA)" as test type
2. In Step 2, for each variant:
   - **CTA Text field**: Enter button text
   - **CTA Color picker**: Choose button color
   - **CTA Position dropdown**: Select placement

**Position Options**:
- `top`: Button appears at top of article
- `middle`: Button appears in middle of content
- `bottom`: Button appears at bottom

---

### 3. IMAGE TEST

**What it tests**: Different featured images  
**Best for**: Improving visual appeal and engagement

**Example Scenario**: Testing product images

```json
// Control (Original)
{} // Uses existing featured image

// Variant A - Lifestyle image
{
  "featuredImage": "https://example.com/lifestyle-headphones.jpg"
}

// Variant B - Product close-up
{
  "featuredImage": "https://example.com/headphones-closeup.jpg"
}

// Variant C - Person using product
{
  "featuredImage": "https://example.com/person-wearing-headphones.jpg"
}
```

**Where to set in UI**:
1. Select "Featured Image" as test type
2. In Step 2, for each variant:
   - **Featured Image URL field**: Enter image URL

**Image Requirements**:
- Use HTTPS URLs
- Recommended size: 1200x630px
- Formats: JPG, PNG, WebP
- Optimize for web (under 500KB)

---

### 4. LAYOUT TEST

**What it tests**: Different page layouts  
**Best for**: Improving user experience and engagement

**Example Scenario**: Testing product grid layouts

```json
// Control (Original)
{} // Uses existing layout

// Variant A - Grid layout
{
  "layout": "grid"
}

// Variant B - List layout
{
  "layout": "list"
}

// Variant C - Masonry layout
{
  "layout": "masonry"
}

// Variant D - Full-width layout
{
  "layout": "full-width"
}
```

**Where to set in UI**:
1. Select "Page Layout" as test type
2. In Step 2, for each variant:
   - **Layout Style dropdown**: Choose layout type

**Layout Options**:
- `grid`: Products in a grid (3-4 columns)
- `list`: Products in a vertical list
- `masonry`: Pinterest-style staggered grid
- `full-width`: Single column, full browser width

---

### 5. FULL PAGE TEST

**What it tests**: Complete page redesigns  
**Best for**: Major changes, complete redesigns

**Example Scenario**: Testing completely different product pages

```json
// Control (Original)
{} // Uses existing article content

// Variant A - Minimal design
{
  "title": "Premium Headphones - Minimalist Design",
  "featuredImage": "https://example.com/minimal-headphones.jpg",
  "layout": "full-width",
  "ctaText": "Buy",
  "ctaColor": "#000000",
  "ctaPosition": "top",
  "content": {
    "products": [
      {
        "id": "headphones-1",
        "name": "Premium Headphones",
        "price": "$199",
        "image": "https://example.com/product1.jpg",
        "description": "Clean, minimal design"
      }
    ],
    "sections": [
      {
        "type": "hero",
        "title": "Less is More",
        "subtitle": "Premium sound, minimal design"
      }
    ],
    "customHTML": "<div class='minimal-section'><h3>Why Choose Minimal?</h3><p>Focus on what matters.</p></div>"
  },
  "customCSS": ".article { background: #f8f8f8; } .minimal-section { padding: 20px; }"
}

// Variant B - Feature-rich design
{
  "title": "Premium Headphones - All Features Included",
  "featuredImage": "https://example.com/feature-rich-headphones.jpg", 
  "layout": "grid",
  "ctaText": "Get All Features",
  "ctaColor": "#0066CC",
  "ctaPosition": "bottom",
  "content": {
    "products": [
      {
        "id": "headphones-1",
        "name": "Premium Headphones",
        "price": "$199",
        "image": "https://example.com/product1.jpg",
        "features": ["Noise Canceling", "30hr Battery", "Wireless", "Premium Materials"],
        "description": "Every feature you need"
      }
    ],
    "sections": [
      {
        "type": "features",
        "title": "Everything Included",
        "features": [
          {"name": "Noise Canceling", "icon": "🔇"},
          {"name": "Long Battery", "icon": "🔋"},
          {"name": "Wireless", "icon": "📶"},
          {"name": "Premium Build", "icon": "⭐"}
        ]
      }
    ],
    "customHTML": "<div class='feature-grid'><div class='feature'>Noise Canceling</div><div class='feature'>30hr Battery</div></div>"
  },
  "customCSS": ".feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; } .feature { padding: 15px; background: #e3f2fd; }"
}
```

**Where to set in UI**:
1. Select "Full Page Content" as test type
2. In Step 2, for each variant:
   - **Custom Changes (JSON) textarea**: Enter complete JSON structure

**Full Page JSON Structure**:
```json
{
  "title": "Page title",
  "metaTitle": "SEO title", 
  "featuredImage": "Image URL",
  "layout": "Layout type",
  "ctaText": "Button text",
  "ctaColor": "Button color",
  "ctaPosition": "Button position",
  "content": {
    "products": [...],      // Product data
    "sections": [...],      // Page sections
    "customHTML": "..."     // Custom HTML
  },
  "customCSS": "..."        // Custom styles
}
```

---

## 🚦 Traffic Distribution Examples

### Manual Mode Examples

**Conservative Testing** (when unsure):
```
Control: 70%    (most traffic stays on original)
Variant A: 20%  (small test group)
Variant B: 10%  (smaller test group)
```

**Balanced Testing** (standard approach):
```
Control: 50%    (half see original)
Variant A: 30%  (good sample size)
Variant B: 20%  (smaller but valid sample)
```

**Aggressive Testing** (when confident):
```
Control: 25%    (minimal control group)
Variant A: 40%  (primary test)
Variant B: 35%  (secondary test)
```

### Auto-Pilot Mode

**How it works**:
1. **Start**: Equal distribution (33% each for 3 variants)
2. **Collect**: Minimum 100 views per variant
3. **Analyze**: Statistical significance testing
4. **Optimize**: 90% to winner, 10% split among others
5. **Continue**: Re-evaluate as more data comes in

**Example progression**:
```
Week 1: Control 33%, Variant A 33%, Variant B 33%
Week 2: Control 33%, Variant A 33%, Variant B 33% (still collecting data)
Week 3: Control 10%, Variant A 85%, Variant B 5% (Variant A is winning!)
Week 4: Control 5%, Variant A 90%, Variant B 5% (Variant A confirmed winner)
```

---

## 📊 Understanding Analytics

### Key Metrics Explained

**Views**: How many people saw each variant
**Conversions**: How many took desired action (clicked CTA, bought, etc.)
**Conversion Rate**: (Conversions ÷ Views) × 100
**Click-Through Rate**: (Clicks ÷ Views) × 100
**Statistical Significance**: ✓ means results are reliable (95% confidence)

### Reading the Dashboard

**Summary Section**:
- Total views across all variants
- Total conversions
- Overall conversion rate
- Best performer with improvement %

**Variant Table**:
- Traffic percentage (how much traffic each gets)
- Performance metrics
- Improvement vs control
- Significance indicator

**Visual Chart**:
- Bar chart comparing conversion rates
- Winner highlighted in green
- Significant variants marked with ✓

### When Results Are Reliable

✅ **Reliable** (act on results):
- ✓ Statistical significance shown
- 100+ views per variant
- Test ran for 1+ weeks
- Clear winner (>10% improvement)

⚠️ **Not Yet Reliable** (keep testing):
- "Not yet" significance
- <100 views per variant
- Test ran <1 week
- Results too close to call

---

## 🎯 Step-by-Step: Creating Your First Test

### Example: Testing Product Page Headlines

**Step 1: Navigate**
1. Go to your product article: `/articles/abc123`
2. Scroll to "A/B Tests" section
3. Click "Create A/B Test"

**Step 2: Configuration**
1. **Name**: "Product Headline Test - Nov 2025"
2. **Description**: "Testing benefit vs feature headlines"
3. **Test Type**: Select "Headline / Title"
4. **Distribution**: Select "Manual"

**Step 3: Variants**
1. **Control** (automatically created):
   - Name: "Control (Original)"
   - Description: "Current headline"
   - Changes: `{}` (empty - uses existing)

2. **Variant A**:
   - Name: "Benefit-Focused"
   - Description: "Emphasizes savings"
   - Title: "Save 50% on Premium Headphones"
   - Meta Title: "Premium Headphones Sale - 50% Off"

3. **Variant B**:
   - Name: "Feature-Focused" 
   - Description: "Emphasizes product features"
   - Title: "Noise-Canceling Headphones with 30-Hour Battery"
   - Meta Title: "Best Noise-Canceling Headphones - 30Hr Battery"

**Step 4: Traffic Distribution**
1. Control: 40%
2. Variant A: 30%
3. Variant B: 30%
4. Total: 100% ✓

**Step 5: Launch**
1. Click "Create Test" (creates in draft mode)
2. Review settings
3. Click "Start Test" (goes live immediately)

**Step 6: Monitor**
1. Click "📊 View Analytics"
2. Check daily for first week
3. Look for statistical significance
4. Wait for reliable results (1-2 weeks)

**Step 7: Implement Winner**
1. Identify winning variant
2. Click "Complete Test"
3. Update article with winning headline
4. Start next test!

---

## 🔧 Advanced JSON Examples

### Complex CTA Test
```json
{
  "ctaText": "Get 50% Off Now",
  "ctaColor": "#FF4444",
  "ctaPosition": "top",
  "ctaSize": "large",
  "ctaStyle": "rounded",
  "ctaAnimation": "pulse"
}
```

### Multi-Element Test
```json
{
  "title": "New Headline",
  "featuredImage": "https://example.com/new-image.jpg",
  "ctaText": "Buy Now",
  "ctaColor": "#00AA00",
  "layout": "grid"
}
```

### Content-Heavy Test
```json
{
  "content": {
    "hero": {
      "title": "Custom Hero Title",
      "subtitle": "Custom subtitle",
      "backgroundImage": "https://example.com/hero-bg.jpg"
    },
    "products": [
      {
        "id": "prod1",
        "name": "Product 1",
        "price": "$99",
        "image": "https://example.com/prod1.jpg",
        "badge": "SALE"
      }
    ],
    "testimonials": [
      {
        "text": "Great product!",
        "author": "John Doe",
        "rating": 5
      }
    ]
  }
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This

**Testing too many things at once**:
```json
// BAD - testing headline AND image AND CTA
{
  "title": "New Title",
  "featuredImage": "new-image.jpg", 
  "ctaText": "New Button"
}
```

**Stopping tests too early**:
- Don't stop after 1 day
- Don't stop without significance
- Don't stop with <100 views per variant

**Invalid traffic distribution**:
```
Control: 60%
Variant A: 30%
Variant B: 20%
Total: 110% ❌ (must equal 100%)
```

### ✅ Do This Instead

**Test one thing at a time**:
```json
// GOOD - testing only headline
{
  "title": "New Title"
}
```

**Wait for reliable results**:
- Run for 1-2 weeks minimum
- Wait for statistical significance
- Ensure 100+ views per variant

**Proper traffic distribution**:
```
Control: 50%
Variant A: 30% 
Variant B: 20%
Total: 100% ✅
```

---

## 🎉 Success Stories Examples

### Case Study 1: E-commerce CTA
**Test**: Button text
- Control: "Add to Cart" (2.3% conversion)
- Winner: "Get It Now" (3.8% conversion)
- **Result**: +65% improvement, $50K additional revenue/month

### Case Study 2: Blog Headlines  
**Test**: Article titles
- Control: "10 Tips for Better Sleep" (4.2% CTR)
- Winner: "Can't Sleep? Try These 10 Simple Tricks" (7.1% CTR)
- **Result**: +69% improvement, 2x more article views

### Case Study 3: Product Images
**Test**: Featured images
- Control: Product on white background (5.1% conversion)
- Winner: Person using product (8.3% conversion)  
- **Result**: +63% improvement, better engagement

---

## 📞 Need Help?

### Quick Troubleshooting

**Test not showing changes?**
1. Verify test status is "running"
2. Clear browser cache
3. Check traffic percentage > 0%

**No data in analytics?**
1. Wait 24 hours for data
2. Check Mixpanel dashboard
3. Verify article has traffic

**Can't create test?**
1. Check all required fields filled
2. Ensure traffic totals 100%
3. Verify at least 2 variants

### Support Resources
- Full guide: `AB_TESTING_GUIDE.md`
- Setup instructions: `AB_TESTING_SETUP.md`
- Mixpanel dashboard: https://mixpanel.com/project/3829444

---

**Ready to start testing?** Go to any article and create your first A/B test! 🚀

