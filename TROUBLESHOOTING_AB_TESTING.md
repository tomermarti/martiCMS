# 🔧 A/B Testing Troubleshooting

## Issue 1: ✅ FIXED - Can't See Existing Test

**Problem**: Created a test but can't see it in the UI

**Solution**: Updated the UI component to show existing tests!

Now when you go to the article edit page, you'll see:
- 📊 Active test name
- All variants with their traffic %
- What changes each variant has
- Button to remove the test

## Issue 2: Article Doesn't Load JSON

**Problem**: The published article doesn't run the A/B test

**Root Cause**: Published articles need to be regenerated with the A/B testing script

### Quick Fix Steps:

#### Step 1: Check if JSON File Exists
```bash
# Check if the file was created
ls -la public/your-article-slug/ab-tests.json

# View the contents
cat public/your-article-slug/ab-tests.json
```

#### Step 2: Republish the Article

The A/B testing script needs to be in the published HTML. You need to:

1. **Go to the article edit page**
2. **Click "Publish" or "Update"** to regenerate the HTML
3. **The new HTML will include the A/B testing script**

#### Step 3: Check the Published HTML

Open your published article HTML file and look for:
```html
<!-- Pure Static A/B Testing & Mixpanel Integration -->
<script src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"></script>
<script>
  // A/B testing code here...
</script>
```

If you don't see this, the article needs to be republished.

### For Digital Ocean Spaces

If you're deploying to DO Spaces, you need to:

1. **Create the A/B test** (creates JSON file locally)
2. **Republish the article** (regenerates HTML with script)
3. **Upload both files to DO**:
   - `article-slug/index.html` (with A/B script)
   - `article-slug/ab-tests.json` (test configuration)

### Quick Test Locally

1. **Create test**: Go to article edit, create A/B test
2. **Check JSON**: `cat public/article-slug/ab-tests.json`
3. **View article**: `http://localhost:3001/article-slug/`
4. **Open browser console**: Should see A/B testing logs

Expected console output:
```
🚀 Pure Static A/B Testing loaded for: article-slug
📂 Loading A/B test data from: /article-slug/ab-tests.json
📊 Loaded A/B test data: {...}
🧪 Active test found: Headline Test (headline)
🎯 Assigned to variant: New Headline (Test Variant)
📊 Traffic allocation: 50%
🎨 Applying variant changes: {...}
✅ Updated H1 title
📊 Events tracked to Mixpanel
✅ A/B testing initialization complete!
```

## Common Issues

### Issue: "No A/B test file found"

**Cause**: JSON file doesn't exist or wrong path

**Fix**:
```bash
# Check if file exists
ls public/article-slug/ab-tests.json

# If not, create test again in CMS
```

### Issue: "Failed to fetch JSON"

**Cause**: Article slug mismatch or file not deployed

**Fix**:
1. Verify article slug matches folder name
2. Ensure JSON file is in correct location
3. Check file permissions

### Issue: Changes Not Appearing

**Cause**: Variant is control or changes not applied

**Fix**:
1. Check browser console for logs
2. Verify you're not in the control group (50% chance)
3. Clear localStorage and reload:
```javascript
localStorage.clear()
location.reload()
```

### Issue: Not Tracking to Mixpanel

**Cause**: Mixpanel not initialized or network blocked

**Fix**:
1. Check browser console for Mixpanel errors
2. Verify Mixpanel token is correct
3. Check if ad blockers are interfering

## Debug Commands

### Check Current Test Assignment
```javascript
// In browser console
localStorage.getItem('ab_session_id')
localStorage.getItem('ab_test_test_XXXXX_variant')
```

### Force Specific Variant
```javascript
// Clear and reload to get reassigned
localStorage.clear()
location.reload()
```

### View Mixpanel Events
```javascript
// Check what's being tracked
mixpanel.get_distinct_id()
```

## File Locations

```
martiCMS/
├── public/
│   └── article-slug/
│       ├── index.html          ← Must have A/B script
│       └── ab-tests.json       ← Test configuration
├── lib/
│   ├── simple-ab-testing.ts    ← Creates JSON files
│   └── ab-testing-frontend-only.ts ← Frontend script
└── components/
    └── SimpleABTestCreator.tsx ← UI component
```

## Deployment Checklist

- [ ] Created A/B test in CMS
- [ ] JSON file exists in `public/article-slug/`
- [ ] Article HTML includes A/B testing script
- [ ] Both files uploaded to DO Spaces
- [ ] CDN cache purged (if applicable)
- [ ] Tested locally first
- [ ] Checked browser console for logs
- [ ] Verified Mixpanel receiving events

## Need More Help?

1. **Check browser console** - Most issues show up there
2. **Verify file exists** - `ls public/article-slug/ab-tests.json`
3. **Test locally first** - Before deploying to DO
4. **Check Mixpanel** - See if events are coming through

## Quick Reference

**Create test**:
```
1. Go to article edit page
2. Scroll to A/B Testing section
3. Enter new value
4. Click "Create A/B Test"
5. Republish article
```

**Remove test**:
```
1. Go to article edit page
2. Click "Remove This Test"
3. Republish article
```

**Deploy to DO**:
```
1. Upload index.html (with A/B script)
2. Upload ab-tests.json
3. Purge CDN cache
```

---

**Most Common Fix**: Just republish the article after creating the test! 🚀

