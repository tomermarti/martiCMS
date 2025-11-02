# 🎯 Simple A/B Testing - Easy as 1-2-3!

Super simple A/B testing for your static site. No database, no complexity, just works!

## 🚀 Quick Start (3 Steps)

### Step 1: Create a Test

```typescript
import { createHeadlineTest } from '@/lib/simple-ab-testing'

// Test a new headline - that's it!
await createHeadlineTest(
  'best-headphones',           // Your article slug
  'Original Title',            // Current title (for reference)
  '🚀 Save 50% Today Only!',  // New title to test
  50                           // 50% traffic to each
)
```

**Done!** File created at `/public/best-headphones/ab-tests.json`

### Step 2: Deploy

Deploy your site like normal. The JSON file goes with your HTML files.

### Step 3: Watch Results

Check Mixpanel to see which version performs better!

## 📝 **More Examples**

### Test a CTA Button

```typescript
import { createCTATest } from '@/lib/simple-ab-testing'

await createCTATest(
  'best-headphones',
  'Buy Now',        // New button text
  '#FF0000',        // New button color (optional)
  50                // Traffic split
)
```

### Test an Image

```typescript
import { createImageTest } from '@/lib/simple-ab-testing'

await createImageTest(
  'best-headphones',
  'https://example.com/new-image.jpg',
  50
)
```

### Test Multiple Things (Advanced)

```typescript
import { createABTest } from '@/lib/simple-ab-testing'

await createABTest('best-headphones', 'Full Test', [
  {
    name: 'Control',
    traffic: 40,
    isControl: true,
    changes: {}
  },
  {
    name: 'Variant A - Benefit Focus',
    traffic: 30,
    isControl: false,
    changes: {
      title: '🎧 Save 50% on Premium Headphones',
      ctaText: 'Get Deal Now',
      ctaColor: '#00AA00'
    }
  },
  {
    name: 'Variant B - Urgency Focus',
    traffic: 30,
    isControl: false,
    changes: {
      title: '⏰ Only 24 Hours Left!',
      ctaText: 'Claim Offer',
      ctaColor: '#FF0000'
    }
  }
])
```

### Remove a Test

```typescript
import { removeABTest } from '@/lib/simple-ab-testing'

await removeABTest('best-headphones')
```

## 📄 **What Gets Created**

A simple JSON file at `/public/your-article-slug/ab-tests.json`:

```json
{
  "articleSlug": "best-headphones",
  "timestamp": "2025-10-30T16:00:00.000Z",
  "tests": [
    {
      "id": "test_1730304000000",
      "name": "Headline Test",
      "variants": [
        {
          "id": "variant_0",
          "name": "Control (Original)",
          "isControl": true,
          "trafficPercent": 50,
          "changes": {}
        },
        {
          "id": "variant_1",
          "name": "New Headline",
          "isControl": false,
          "trafficPercent": 50,
          "changes": {
            "title": "🚀 Save 50% Today Only!"
          }
        }
      ]
    }
  ]
}
```

## 🎨 **What You Can Test**

### Headline Changes
```typescript
changes: {
  title: "New Headline"
}
```

### CTA Button Changes
```typescript
changes: {
  ctaText: "Buy Now",
  ctaColor: "#FF0000"
}
```

### Image Changes
```typescript
changes: {
  image: "https://example.com/new-image.jpg"
}
```

### Multiple Changes
```typescript
changes: {
  title: "New Headline",
  ctaText: "Buy Now",
  ctaColor: "#00AA00",
  image: "https://example.com/image.jpg"
}
```

## 🔧 **Integration with Your CMS**

### Option 1: Add to Article Form

Add a simple A/B testing section to your article edit page:

```typescript
// In your article edit page
import { createHeadlineTest } from '@/lib/simple-ab-testing'

function handleCreateTest() {
  await createHeadlineTest(
    article.slug,
    article.title,
    newTitleInput.value,
    50
  )
  alert('✅ A/B test created!')
}
```

### Option 2: Standalone Test Creator

Create a simple page at `/ab-tests/new`:

```typescript
'use client'

import { useState } from 'react'
import { createHeadlineTest } from '@/lib/simple-ab-testing'

export default function CreateABTest() {
  const [articleSlug, setArticleSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  
  async function handleSubmit() {
    await createHeadlineTest(articleSlug, '', newTitle, 50)
    alert('✅ Test created!')
  }
  
  return (
    <div>
      <h1>Create A/B Test</h1>
      <input 
        placeholder="Article slug (e.g., best-headphones)"
        value={articleSlug}
        onChange={e => setArticleSlug(e.target.value)}
      />
      <input 
        placeholder="New title to test"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
      />
      <button onClick={handleSubmit}>Create Test</button>
    </div>
  )
}
```

### Option 3: API Route (Optional)

```typescript
// app/api/simple-ab/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createHeadlineTest } from '@/lib/simple-ab-testing'

export async function POST(request: NextRequest) {
  const { articleSlug, newTitle } = await request.json()
  
  await createHeadlineTest(articleSlug, '', newTitle, 50)
  
  return NextResponse.json({ success: true })
}
```

## 📊 **Tracking Results**

All events go straight to Mixpanel:

- **Variant Viewed** - When someone sees a variant
- **Conversion** - When they click CTA
- **Article Click** - When they interact
- **Article Exit** - Time on page

Check your Mixpanel dashboard at: https://mixpanel.com/project/3829444

## 🎯 **Best Practices**

### ✅ Do This:
- Test one thing at a time
- Run tests for at least 1 week
- Use 50/50 traffic split to start
- Wait for enough data (100+ views per variant)

### ❌ Don't Do This:
- Test too many things at once
- Stop tests too early
- Use uneven splits without reason
- Make traffic not add up to 100%

## 🚀 **Deployment Workflow**

Your current workflow:
```
Edit Article → Generate HTML → Deploy
```

New workflow:
```
Edit Article → Generate HTML → Create A/B Test (optional) → Deploy
                                      ↓
                              ab-tests.json created
```

**Same process, one optional extra step!**

## 💡 **Pro Tips**

### Tip 1: Test High-Impact Pages First
Start with your most popular articles to get data faster.

### Tip 2: Use Emojis Strategically
```typescript
// Original: "Best Headphones 2025"
// Test: "🎧 Best Headphones 2025" or "🔥 Best Headphones 2025"
```

### Tip 3: Test Urgency
```typescript
// Original: "Premium Headphones on Sale"
// Test: "⏰ Only 24 Hours Left - Premium Headphones"
```

### Tip 4: Test Benefits vs Features
```typescript
// Features: "Noise-Canceling Headphones with 30-Hour Battery"
// Benefits: "Work in Peace - Block Out Noise for 30 Hours"
```

## 🎉 **That's It!**

Simple A/B testing in 3 steps:
1. Create test (one function call)
2. Deploy (same as always)
3. Check results (Mixpanel)

**No database, no complexity, just works!** 🚀

---

## 📞 **Quick Reference**

```typescript
// Import
import { 
  createHeadlineTest, 
  createCTATest, 
  createImageTest,
  createABTest,
  removeABTest 
} from '@/lib/simple-ab-testing'

// Create headline test
await createHeadlineTest('article-slug', 'old', 'new', 50)

// Create CTA test
await createCTATest('article-slug', 'Buy Now', '#FF0000', 50)

// Create image test
await createImageTest('article-slug', 'https://...', 50)

// Remove test
await removeABTest('article-slug')
```

**That's all you need to know!** 🎯

