# Deployment Guide

This guide covers deploying MartiCMS to Vercel with PostgreSQL and Digital Ocean Spaces.

## Prerequisites

- Node.js 18+ installed
- Git installed
- PostgreSQL database (provided)
- Digital Ocean Spaces account (provided)
- Vercel account (free tier works)

## Quick Start

### 1. Initial Setup

```bash
# Clone or navigate to the project
cd amazon-static

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manually:
npm install
npx prisma generate
npx prisma db push
```

### 2. Local Development

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

### 3. Test the CMS

1. Create a test article
2. Add some content
3. Check "Publish to Digital Ocean Spaces"
4. Click "Create Article"
5. Verify the HTML is generated at: `https://deals.nyc3.digitaloceanspaces.com/[slug]/index.html`

## Deploying to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? marti-cms (or your choice)
# - In which directory is your code located? ./
# - Override settings? No
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: .next

### Environment Variables in Vercel

After deployment, add environment variables:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable:

```
DATABASE_URL = postgresql+asyncpg://username:password@your-db-host:port/database_name

DO_SPACES_KEY = YOUR_DO_SPACES_KEY
DO_SPACES_SECRET = YOUR_DO_SPACES_SECRET
DO_SPACES_BUCKET = your_bucket_name
DO_SPACES_REGION = your_region
DO_SPACES_ENDPOINT = https://your_region.digitaloceanspaces.com
```

4. Redeploy to apply changes

### Prisma on Vercel

The build command automatically runs `prisma generate`:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

## Digital Ocean Spaces Configuration

### CORS Configuration

If you need to load resources cross-origin, configure CORS:

1. Go to [cloud.digitalocean.com/spaces](https://cloud.digitalocean.com/spaces)
2. Select your "deals" bucket
3. Go to Settings → CORS Configurations
4. Add:

```json
[
  {
    "origins": ["*"],
    "methods": ["GET", "HEAD"],
    "headers": ["*"],
    "maxAge": 3600
  }
]
```

### CDN Configuration (Optional)

Enable CDN for faster loading:

1. In bucket settings, click "Enable CDN"
2. Your articles will be available at:
   - Without CDN: `https://deals.nyc3.digitaloceanspaces.com/[slug]/index.html`
   - With CDN: `https://deals.nyc3.cdn.digitaloceanspaces.com/[slug]/index.html`

## Custom Domain Setup

### For the CMS (Vercel)

1. Go to Project Settings → Domains
2. Add your domain (e.g., `cms.yourdomain.com`)
3. Follow DNS configuration instructions
4. Add CNAME record: `cms.yourdomain.com` → `cname.vercel-dns.com`

### For Articles (Digital Ocean Spaces)

1. Go to Spaces → Settings → Custom Subdomain
2. Add subdomain (e.g., `articles.yourdomain.com`)
3. Add CNAME record: `articles.yourdomain.com` → `deals.nyc3.digitaloceanspaces.com`

## Database Management

### Prisma Studio (Local)

```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555 to manage data.

### Schema Changes

```bash
# Make changes to prisma/schema.prisma

# Push changes to database
npx prisma db push

# Generate new client
npx prisma generate
```

### Database Backup

```bash
# Using pg_dump (if you have direct access)
pg_dump -h your-db-host \
  -U username \
  -d database_name \
  -f backup.sql
```

## Monitoring & Debugging

### Vercel Logs

```bash
# View logs
vercel logs [deployment-url]

# Stream logs in real-time
vercel logs --follow
```

### Check Production Build Locally

```bash
npm run build
npm start
```

## Troubleshooting

### Build Fails on Vercel

**Error**: `Prisma Client not generated`

**Solution**: Ensure `postinstall` script exists:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Timeout

**Error**: `Connection timeout`

**Solution**: 
- Check DATABASE_URL is correct
- Ensure Vercel can reach your database
- Verify database accepts external connections

### Images Not Uploading

**Error**: `Failed to upload image`

**Solution**:
- Verify DO_SPACES_KEY and DO_SPACES_SECRET
- Check bucket exists and is accessible
- Ensure public-read ACL is allowed

### Articles Not Deploying

**Solution**:
- Check "Publish" checkbox is enabled
- Verify DO Spaces credentials
- Look for errors in console/logs
- Test upload manually using AWS CLI

## Performance Optimization

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['deals.nyc3.digitaloceanspaces.com'],
  },
  compress: true,
}
```

### Database Connection Pooling

If you experience connection issues, use Prisma connection pooling:

```
DATABASE_URL="postgresql://..."?connection_limit=10&pool_timeout=10
```

## Security Best Practices

1. **Never commit .env file**
   - Already in `.gitignore`
   - Use Vercel environment variables

2. **Rotate credentials regularly**
   - Change DO Spaces keys every 90 days
   - Update DATABASE_URL if needed

3. **Restrict bucket access**
   - Only allow uploads from your app
   - Use signed URLs for sensitive content

4. **Add authentication** (Optional)
   - Use NextAuth.js
   - Protect CMS routes
   - Add user roles

## Scaling Considerations

### Database

- Current setup uses Digital Ocean managed PostgreSQL
- Can handle thousands of articles
- Consider upgrading plan for high traffic

### Storage

- Digital Ocean Spaces: 250GB included
- Scales automatically
- CDN included for faster delivery

### CMS

- Vercel handles auto-scaling
- Serverless functions scale automatically
- Edge caching for static content

## Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [DO Spaces Docs](https://docs.digitalocean.com/products/spaces/)

## Maintenance Schedule

### Weekly
- Review article performance
- Check error logs
- Monitor database size

### Monthly
- Update dependencies: `npm update`
- Review and optimize slow queries
- Backup database

### Quarterly
- Rotate access credentials
- Review and archive old articles
- Update Next.js/React versions

---

## Quick Commands Reference

```bash
# Development
npm run dev           # Start dev server
npm run build        # Production build
npm start            # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
npx prisma generate  # Regenerate client

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production
vercel logs          # View logs
```

## Need Help?

Check the main [README.md](./README.md) for usage instructions and API documentation.