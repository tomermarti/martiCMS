# 🚀 A/B Testing with Digital Ocean CDN

## ✅ **How It Works Now**

Your A/B testing system is fully integrated with Digital Ocean Spaces CDN!

### **Flow:**
```
1. Create Test in CMS → 2. JSON uploaded to DO → 3. Article reads from CDN
         ↓                        ↓                        ↓
   Local + CDN              article-slug/          Zero latency!
                           ab-tests.json
```

## 📁 **File Locations**

### **On Digital Ocean Spaces:**
```
your-bucket/
├── article-slug/
│   ├── index.html          ← Article HTML (with A/B script)
│   └── ab-tests.json       ← A/B test config (uploaded automatically!)
```

### **CDN URL:**
```
https://daily.get.martideals.com/article-slug/ab-tests.json
```

## 🎯 **Complete Workflow**

### **Step 1: Create A/B Test**

1. Go to article edit page: `http://localhost:3004/articles/[id]`
2. Scroll to "🧪 A/B Testing" section
3. Choose test type (Headline, Button, Image)
4. Enter new value
5. Click "✨ Create A/B Test"

**What happens:**
- ✅ JSON file created locally in `public/article-slug/`
- ✅ JSON file uploaded to Digital Ocean Spaces
- ✅ CDN URL: `https://daily.get.martideals.com/article-slug/ab-tests.json`

### **Step 2: Verify Upload**

Check the console output:
```
✅ Created A/B test file: /path/to/public/article-slug/ab-tests.json
✅ A/B test JSON uploaded to CDN: https://daily.get.martideals.com/article-slug/ab-tests.json
```

### **Step 3: Article Automatically Uses CDN**

The article HTML already has the A/B testing script that:
1. Loads from CDN: `https://daily.get.martideals.com/article-slug/ab-tests.json`
2. Assigns variant based on session
3. Applies changes
4. Tracks to Mixpanel

**No republishing needed!** The article HTML already has the script.

## 🔍 **Check Your Setup**

### **1. Verify JSON on CDN**

Visit in browser:
```
https://daily.get.martideals.com/your-article-slug/ab-tests.json
```

You should see:
```json
{
  "articleSlug": "your-article-slug",
  "timestamp": "2025-10-30T...",
  "tests": [
    {
      "id": "test_...",
      "name": "Headline Test",
      "variants": [...]
    }
  ]
}
```

### **2. Check Article HTML**

Visit your article:
```
https://daily.get.martideals.com/your-article-slug/
```

Open browser console - you should see:
```
🚀 Pure Static A/B Testing loaded for: your-article-slug
📂 Loading A/B test data from: /your-article-slug/ab-tests.json
📊 Loaded A/B test data: {...}
🧪 Active test found: Headline Test
🎯 Assigned to variant: New Headline (50%)
✅ A/B testing initialization complete!
```

### **3. Verify in CMS**

Go back to article edit page - you should see:
```
📊 Active Test: Headline Test [Running]
  Control (Original) - 50%
  New Headline - 50%
    📝 Title: "Your new title here"
```

## 🎨 **What Gets Uploaded**

### **JSON Structure on CDN:**
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

## 🚀 **Benefits of CDN Approach**

✅ **Global distribution** - Fast worldwide  
✅ **Automatic caching** - CDN handles it  
✅ **No local files needed** - Articles read from CDN  
✅ **Instant updates** - Change test, uploads immediately  
✅ **Same workflow** - Fits your existing process  
✅ **Zero server calls** - Pure static from CDN  

## 🔧 **Troubleshooting**

### **Issue: Can't see existing test in CMS**

**Check:**
1. Is the JSON on CDN? Visit: `https://daily.get.martideals.com/article-slug/ab-tests.json`
2. Check browser console for errors
3. Try refreshing the page

**Fix:**
- The UI now checks CDN automatically
- Uses cache-busting: `?v=${Date.now()}`

### **Issue: Article doesn't show variant**

**Check:**
1. Open browser console on the article page
2. Look for A/B testing initialization logs
3. Check if JSON is loading from CDN

**Common causes:**
- JSON not uploaded to CDN yet
- Article HTML doesn't have A/B script (need to republish)
- Ad blocker blocking Mixpanel

**Fix:**
```bash
# 1. Verify JSON exists on CDN
curl https://daily.get.martideals.com/article-slug/ab-tests.json

# 2. Check article HTML has the script
curl https://daily.get.martideals.com/article-slug/ | grep "Pure Static A/B Testing"

# 3. If missing, republish the article
```

### **Issue: Changes not appearing**

**Remember:**
- 50% chance you're in control group (sees original)
- Clear localStorage to get reassigned:
```javascript
localStorage.clear()
location.reload()
```

## 📊 **Monitoring**

### **Check Mixpanel:**
https://mixpanel.com/project/3829444

Look for events:
- **Variant Viewed** - Test is working
- **Conversion** - Users clicking CTAs
- **Article Click** - Engagement tracking

### **Check CDN:**
```bash
# List all A/B test files
curl https://daily.get.martideals.com/ | grep "ab-tests.json"

# Check specific test
curl https://daily.get.martideals.com/article-slug/ab-tests.json
```

## 🎯 **Quick Commands**

### **Create test:**
1. Go to article edit page
2. Scroll to A/B Testing
3. Click test type
4. Enter value
5. Click "Create A/B Test"
6. ✅ Automatically uploaded to CDN!

### **Remove test:**
1. Go to article edit page
2. Click "🗑️ Remove This Test"
3. ✅ Automatically removed from CDN!

### **Check if working:**
```bash
# Check JSON on CDN
curl https://daily.get.martideals.com/your-slug/ab-tests.json

# Check article loads it
curl https://daily.get.martideals.com/your-slug/ | grep "ab-tests.json"
```

## 🎉 **You're All Set!**

Your A/B testing system now:
- ✅ Uploads to Digital Ocean Spaces automatically
- ✅ Articles read from CDN (zero latency)
- ✅ Shows existing tests in CMS
- ✅ Removes from CDN when deleted
- ✅ Works globally via CDN

**Just create a test and it works!** 🚀

---

## 📞 **Need Help?**

1. **Check browser console** - Most info is there
2. **Verify CDN URL** - `https://daily.get.martideals.com/slug/ab-tests.json`
3. **Check Mixpanel** - See if events are coming through
4. **Clear cache** - `localStorage.clear()` and reload

**The system is fully automatic - just create tests and they work!** 🎯

