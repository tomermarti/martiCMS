# 🚀 MartiCMS Quick Start Guide

Get your CMS running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Your database credentials (provided)
- Your Digital Ocean Spaces credentials (provided)

## Installation

### Step 1: Install Dependencies

```bash
cd amazon-static
npm install
```

### Step 2: Configure Database

The `.env` file should already exist with your credentials:

```env
DATABASE_URL=postgresql+asyncpg://username:password@your-db-host:port/database_name

DO_SPACES_KEY=YOUR_DO_SPACES_KEY
DO_SPACES_SECRET=YOUR_DO_SPACES_SECRET
DO_SPACES_BUCKET=your_bucket_name
DO_SPACES_REGION=your_region
DO_SPACES_ENDPOINT=https://your_region.digitaloceanspaces.com
```

### Step 3: Initialize Database

```bash
npx prisma generate
npx prisma db push
```

This creates the `martiCMS` database and tables automatically.

### Step 4: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## First Article

### Create Your First Article

1. **Click "Create New Article"**

2. **Fill Basic Info:**
   - Title: "My First Article"
   - Author: Your name
   - Content Type: Single Product

3. **Add Content:**
   - Product Description: Write about your product
   - Product Link: https://amazon.com/your-product
   - Rating: 5 stars

4. **Add Tracking (Optional):**
   - Facebook Pixel: Your pixel ID
   - Custom Scripts: Any tracking code

5. **Publish:**
   - ✅ Check "Publish to Digital Ocean Spaces"
   - Click "Create Article"

6. **View Your Article:**
   - Click "View →" button
   - Your article is live at: `https://deals.nyc3.digitaloceanspaces.com/my-first-article/index.html`

## File Structure on Digital Ocean

When you publish an article with slug `pets`, it creates:

```
deals/
└── pets/
    ├── index.html          # Your article page
    └── images/             # Uploaded images
        ├── 12345-dog.jpg
        └── 67890-cat.jpg
```

## Common Tasks

### Edit an Article

1. Go to dashboard (/)
2. Click "Edit" on any article
3. Make changes
4. Click "Update Article"

### Upload Images

1. In the article form, find image upload section
2. Click the upload area or drag & drop
3. Image is automatically uploaded to DO Spaces
4. URL is inserted into the form

### Add Multiple Products

1. Select "Multiple Products" content type
2. Click "+ Add Product"
3. Fill in product details
4. Add as many products as needed

### Add Custom Scripts

In the "Scripts & Tracking" section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Mixpanel -->
<script type="text/javascript">
  (function(c,a){...})();
  mixpanel.init("YOUR_TOKEN");
</script>
```

## Verification

Run the verification script to ensure everything is set up correctly:

```bash
node scripts/verify-setup.js
```

Expected output:
```
✅ All checks passed!
Your MartiCMS is ready to use!
```

## Deploy to Production

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then redeploy
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Troubleshooting

### "Database connection failed"

```bash
# Test database connection
npx prisma studio
```

If it fails, check your DATABASE_URL in `.env`.

### "Upload failed"

- Verify DO_SPACES_KEY and DO_SPACES_SECRET
- Ensure bucket "deals" exists
- Check bucket has public-read permissions

### "Module not found"

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"

```bash
npx prisma generate
```

## Features Overview

### Content Types

**Single Product**
- Perfect for product reviews
- One product showcase with description, link, CTA
- Star ratings support

**Multiple Products**
- Great for "Top 10" lists
- Multiple product cards with images
- Introduction section

**Blog Article**
- Long-form content
- Standard article layout
- Full SEO support

### SEO Features

- ✅ Meta title and description
- ✅ Keywords
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Schema.org JSON-LD

### Tracking & Scripts

- ✅ Facebook Pixel integration
- ✅ Custom JavaScript injection
- ✅ Google Analytics support
- ✅ Any tracking service

### Publishing

- ✅ Draft mode (save without publishing)
- ✅ One-click publish to DO Spaces
- ✅ Automatic HTML generation
- ✅ Clean, SEO-optimized templates

## Pro Tips

### 1. Use Descriptive Slugs

Bad: `article-1`, `post-123`
Good: `best-winter-jackets-2024`, `iphone-15-review`

### 2. Optimize Images

- Use compressed images (< 500KB)
- Use descriptive filenames
- Add alt text in the template

### 3. SEO Best Practices

- Write unique meta descriptions (150-160 chars)
- Use 3-5 relevant keywords
- Set canonical URLs for duplicate content

### 4. Organize by Topic

Use consistent slug patterns:
- `pets/best-dog-food`
- `pets/cat-toys-guide`
- `tech/iphone-review`
- `tech/laptop-comparison`

### 5. Test Before Publishing

1. Save as draft first
2. Review content
3. Check all links work
4. Then publish

## Support & Resources

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Production deployment guide
- **Next.js Docs** - https://nextjs.org/docs
- **Prisma Docs** - https://www.prisma.io/docs

## What's Next?

1. ✅ Create your first article
2. ✅ Customize the HTML template (`lib/template.ts`)
3. ✅ Add authentication (optional)
4. ✅ Deploy to Vercel
5. ✅ Set up custom domain
6. ✅ Monitor with analytics

---

**Need help?** Check the full [README.md](./README.md) or review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment.

**Happy publishing! 🎉**