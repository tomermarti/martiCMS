# 🚀 How to Activate Your A/B Test

## The Problem

You created an A/B test and the JSON file exists on the CDN:
```
https://daily.get.martideals.com/24-hour-sale-once-it-s-gone-it-s-gone-1/ab-tests.json ✅
```

**BUT** the article HTML wasn't republished, so it doesn't include the A/B testing script yet.

## The Solution

You need to **republish the article** to inject the A/B testing script into the HTML.

### Option 1: Use the UI (Easiest)

1. Go to your article edit page:
   ```
   http://localhost:3004/articles/cmhd9vp7f0001dcbcvsdl4umq
   ```

2. Scroll to the **"🧪 A/B Testing"** section

3. You'll see your active test displayed

4. Click the **"🚀 Republish Article"** button

5. Confirm the republish

6. Done! The article HTML will be regenerated and uploaded to DO Spaces with the A/B testing script

### Option 2: Use the API Directly

Make a POST request to republish:

```bash
curl -X POST http://localhost:3004/api/republish \
  -H "Content-Type: application/json" \
  -d '{"articleSlug": "24-hour-sale-once-it-s-gone-it-s-gone-1"}'
```

### Option 3: Republish All Articles

If you want to republish ALL articles (to ensure they all have the latest A/B testing script):

```bash
curl -X POST http://localhost:3004/api/republish-all
```

## What Happens When You Republish?

1. ✅ Fetches article from database
2. ✅ Generates new HTML with A/B testing script
3. ✅ Uploads HTML to DO Spaces: `https://daily.get.martideals.com/{slug}/index.html`
4. ✅ Purges CDN cache for fresh content

## Verify It's Working

After republishing, open your article in a browser:
```
https://daily.get.martideals.com/24-hour-sale-once-it-s-gone-it-s-gone-1/index.html
```

### Check Browser Console (F12)

You should see these logs:
```
🚀 Pure Static A/B Testing loaded for: 24-hour-sale-once-it-s-gone-it-s-gone-1
🚀 Initializing A/B testing for: 24-hour-sale-once-it-s-gone-it-s-gone-1
👤 Session ID: session_1730...
📂 Loading A/B test data from CDN: https://daily.get.martideals.com/24-hour-sale-once-it-s-gone-it-s-gone-1/ab-tests.json?v=...
📊 Loaded A/B test data from CDN: {articleSlug: "24-hour-sale-once-it-s-gone-it-s-gone-1", ...}
🧪 Active test found: Headline Test (headline)
🎯 Assigned to variant: New Headline (Test Variant)
📊 Traffic allocation: 50%
🎨 Applying variant changes: {title: "this is an ab test "}
✅ Updated H1 title
📊 Events tracked to Mixpanel
✅ A/B testing initialization complete!
```

### Check the Page

If you're assigned to the **Test Variant** (50% chance), you should see:
- **Title changed to:** "this is an ab test "
- **H1 changed to:** "this is an ab test "

If you're assigned to the **Control** (50% chance), you'll see:
- **Original title:** "24-Hour Sale – Once It's Gone, It's GONE!"

### Force a Different Variant

To test both variants:
1. Open browser console
2. Run: `localStorage.clear()`
3. Refresh the page
4. You'll be randomly assigned again (50/50 chance)

## Why Wasn't It Republished Automatically?

The A/B test was created **before** I added the auto-republish feature to the API routes. Now, when you create or remove a test, the article will automatically republish.

## Future Tests

For any **new** A/B tests you create:
- ✅ JSON will be uploaded to CDN
- ✅ Article HTML will be **automatically republished**
- ✅ No manual republish needed!

## Troubleshooting

### "No A/B testing logs in console"
- Article HTML wasn't republished yet
- Click "🚀 Republish Article" button

### "JSON file not found"
- Test wasn't created properly
- Try creating the test again

### "Changes not appearing"
- Clear browser cache (Ctrl+Shift+R)
- Try incognito mode
- Check if you're assigned to Control (no changes)

### "Still not working after republish"
- Wait 1-2 minutes for CDN propagation
- Check DO Spaces to verify HTML was uploaded
- Verify JSON file exists on CDN

## Quick Commands

```bash
# Republish single article
curl -X POST http://localhost:3004/api/republish \
  -H "Content-Type: application/json" \
  -d '{"articleSlug": "YOUR-ARTICLE-SLUG"}'

# Republish all articles
curl -X POST http://localhost:3004/api/republish-all

# Check if JSON exists
curl https://daily.get.martideals.com/YOUR-ARTICLE-SLUG/ab-tests.json

# Check if HTML was updated (look for "Pure Static A/B Testing" in source)
curl https://daily.get.martideals.com/YOUR-ARTICLE-SLUG/index.html | grep "Pure Static A/B Testing"
```

## Summary

**Current Status:**
- ✅ JSON file exists on CDN
- ❌ Article HTML not republished yet

**Action Required:**
1. Click "🚀 Republish Article" button in the CMS
2. Wait 1-2 minutes
3. Test the article in browser
4. Check console for A/B testing logs

**Future:**
- All new tests will auto-republish
- No manual action needed

---

**Need Help?** Check the browser console for detailed logs!

