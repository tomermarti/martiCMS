# MartiCMS - Content Management System

A modern, full-featured CMS built with Next.js, React, and PostgreSQL that deploys static HTML pages to Digital Ocean Spaces.

## Features

- ✅ Full CRUD operations for articles
- ✅ Multiple content types (Single Product, Multiple Products, Blog)
- ✅ Image upload to Digital Ocean Spaces
- ✅ SEO optimization (meta tags, keywords, canonical URLs)
- ✅ Facebook Pixel integration
- ✅ Custom JavaScript injection
- ✅ Clean HTML template generation
- ✅ Responsive design using Apple HIG 2024 guidelines
- ✅ Automatic slug generation
- ✅ Draft and publish workflow

## Project Structure

```
amazon-static/
├── app/
│   ├── api/
│   │   ├── articles/
│   │   │   ├── [id]/route.ts    # CRUD operations for single article
│   │   │   └── route.ts          # List and create articles
│   │   └── upload/
│   │       └── route.ts          # Image upload endpoint
│   ├── articles/
│   │   ├── [id]/page.tsx        # Edit article page
│   │   └── new/page.tsx         # Create article page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Dashboard (article list)
├── components/
│   ├── ArticleForm.tsx          # Main article form component
│   └── ImageUpload.tsx          # Image upload component
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── spaces.ts                # Digital Ocean Spaces SDK
│   └── template.ts              # HTML template generator
├── prisma/
│   └── schema.prisma            # Database schema
├── global.css                   # Apple HIG 2024 styles
├── package.json
├── tsconfig.json
└── next.config.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql+asyncpg://username:password@your-db-host:port/database_name

# Digital Ocean Spaces
DO_SPACES_KEY=YOUR_DO_SPACES_KEY
DO_SPACES_SECRET=YOUR_DO_SPACES_SECRET
DO_SPACES_BUCKET=your_bucket_name
DO_SPACES_REGION=your_region
DO_SPACES_ENDPOINT=https://your_region.digitaloceanspaces.com
```

### 3. Initialize Database

```bash
npx prisma db push
```

This will create the `martiCMS` database if it doesn't exist and set up the schema.

### 4. Run Development Server

```bash
npm run dev
```

The CMS will be available at http://localhost:3000

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`

### Deploy Steps

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Go to: Project Settings → Environment Variables
# Add all variables from .env file
```

### Environment Variables in Vercel

Add these in the Vercel dashboard:
- `DATABASE_URL`
- `DO_SPACES_KEY`
- `DO_SPACES_SECRET`
- `DO_SPACES_BUCKET`
- `DO_SPACES_REGION`
- `DO_SPACES_ENDPOINT`

## Usage Guide

### Creating an Article

1. Click "Create New Article"
2. Fill in basic information:
   - **Title**: Article headline
   - **Slug**: URL path (auto-generated from title)
   - **Author**: Content creator name
   - **Content Type**: Choose from:
     - Single Product: One product showcase
     - Multiple Products: Product list/comparison
     - Blog: Regular article

3. Add SEO information:
   - Meta title and description
   - Keywords
   - Canonical URL

4. Upload featured image

5. Add content based on type:
   - **Single Product**: Description, link, CTA text, rating
   - **Multiple Products**: Intro + multiple product cards
   - **Blog**: Long-form text content

6. Configure tracking:
   - Facebook Pixel ID
   - Custom scripts (Google Analytics, Mixpanel, etc.)

7. Check "Publish to Digital Ocean Spaces" to deploy
8. Click "Create Article"

### Article Structure on DO Spaces

When published, articles are stored as:
```
/slug/index.html
/slug/images/image1.jpg
/slug/images/image2.jpg
```

For example, an article with slug `pets` will be accessible at:
```
https://deals.nyc3.digitaloceanspaces.com/pets/index.html
```

### Editing Articles

- Click "Edit" on any article card
- Make changes
- Click "Update Article"
- If published, changes will deploy automatically

### Deleting Articles

- Click "Edit" on the article
- Click "Delete Article" button
- Confirm deletion
- Both database entry and DO Spaces files will be removed

## Content Types

### Single Product

Perfect for:
- Product reviews
- Deal highlights
- Affiliate promotions

Fields:
- Product description
- Product link (Amazon, etc.)
- CTA button text
- Star rating

### Multiple Products

Perfect for:
- Product comparisons
- "Top 10" lists
- Category roundups

Fields:
- Introduction text
- Multiple product cards:
  - Title
  - Description
  - Image
  - Product link

### Blog Article

Perfect for:
- Informational content
- Guides and tutorials
- News articles

Fields:
- Long-form text content
- Featured image
- Standard article layout

## HTML Template

The generated HTML is clean and optimized with:
- ✅ No marti branding
- ✅ Semantic HTML5
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Schema.org JSON-LD
- ✅ Responsive design
- ✅ Apple HIG 2024 styling
- ✅ Fast loading times

## Tech Stack

- **Frontend**: React 19, Next.js 15
- **Styling**: CSS Variables (Apple HIG 2024)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Digital Ocean Spaces (S3-compatible)
- **Hosting**: Vercel (recommended)
- **TypeScript**: Full type safety

## Database Schema

```prisma
model Article {
  id              String    @id @default(cuid())
  slug            String    @unique
  title           String
  metaTitle       String?
  metaDescription String?
  author          String
  featuredImage   String?
  contentType     String
  content         Json
  facebookPixel   String?
  customScripts   String?
  keywords        String[]
  canonicalUrl    String?
  published       Boolean   @default(false)
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

## API Endpoints

### Articles

- `GET /api/articles` - List all articles
- `POST /api/articles` - Create new article
- `GET /api/articles/[id]` - Get single article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Upload

- `POST /api/upload` - Upload image to DO Spaces

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### DO Spaces Upload Fails

- Verify credentials in `.env`
- Check bucket permissions (should be public-read)
- Ensure CORS is configured on the bucket

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## Support

For issues or questions:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Prisma docs](https://www.prisma.io/docs)
3. Check [Digital Ocean Spaces docs](https://docs.digitalocean.com/products/spaces/)

## License

MIT