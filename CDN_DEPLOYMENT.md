# CDN Asset Deployment Guide

This guide explains how to deploy and use your MartiDeals header, footer, and CSS files via CDN.

## 🚀 Quick Deployment

### 1. Sync Layout Manager Content (First Time Setup)
```bash
cd /Users/tomerpoplavski/Downloads/martiCMS
npm run sync-layout
```

### 2. Upload All Assets to CDN
```bash
npm run upload-assets
```

This will upload:
- `styles.css` → `https://daily.get.martideals.com/assets/styles.css`
- `header.html` → `https://daily.get.martideals.com/assets/header.html`
- `footer.html` → `https://daily.get.martideals.com/assets/footer.html`

### 2. Your Assets Are Now Available At:

| Asset | CDN URL |
|-------|---------|
| **CSS** | `https://daily.get.martideals.com/assets/styles.css` |
| **Header** | `https://daily.get.martideals.com/assets/header.html` |
| **Footer** | `https://daily.get.martideals.com/assets/footer.html` |
| **Logo** | `https://daily.get.martideals.com/assets/martideals_logo.png` |

## 📖 Usage Examples

### Complete HTML Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    
    <!-- CDN Stylesheet -->
    <link rel="stylesheet" href="https://daily.get.martideals.com/assets/styles.css">
</head>
<body>
    <!-- Header Container -->
    <div id="header"></div>
    
    <!-- Your Main Content -->
    <main class="main-content">
        <div class="container">
            <h1>Your Content Here</h1>
        </div>
    </main>
    
    <!-- Footer Container -->
    <div id="footer"></div>
    
    <!-- Load Header and Footer -->
    <script>
        // Load Header
        fetch('https://daily.get.martideals.com/assets/header.html')
            .then(response => response.text())
            .then(html => document.getElementById('header').innerHTML = html);
        
        // Load Footer
        fetch('https://daily.get.martideals.com/assets/footer.html')
            .then(response => response.text())
            .then(html => document.getElementById('footer').innerHTML = html);
    </script>
</body>
</html>
```

### WordPress/External Site Integration
```html
<!-- Add to your theme's header.php -->
<link rel="stylesheet" href="https://daily.get.martideals.com/assets/styles.css">

<!-- Add where you want the header -->
<div id="martideals-header"></div>
<script>
fetch('https://daily.get.martideals.com/assets/header.html')
    .then(response => response.text())
    .then(html => document.getElementById('martideals-header').innerHTML = html);
</script>
```

### React/Next.js Integration
```jsx
import { useEffect } from 'react';

export default function Layout({ children }) {
    useEffect(() => {
        // Load header
        fetch('https://daily.get.martideals.com/assets/header.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header').innerHTML = html;
            });
        
        // Load footer
        fetch('https://daily.get.martideals.com/assets/footer.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('footer').innerHTML = html;
            });
    }, []);

    return (
        <>
            <div id="header"></div>
            <main>{children}</main>
            <div id="footer"></div>
        </>
    );
}
```

## ✅ System Alignment

### All Components Now Use `/assets/` Path:

| Component | Path | Description |
|-----------|------|-------------|
| **Articles** | `assets/styles.css` | All generated articles load CSS from CDN |
| **Articles** | `assets/header.html` | All articles load header from CDN |
| **Articles** | `assets/footer.html` | All articles load footer from CDN |
| **Layout Manager** | `assets/header.html` | Layout manager saves header to CDN |
| **Layout Manager** | `assets/footer.html` | Layout manager saves footer to CDN |
| **Manual Upload** | `assets/*` | All manual uploads use assets path |

### Workflow:
1. **Edit** header/footer in Layout Manager → Saves to `assets/` path
2. **Articles** automatically load from `assets/` path  
3. **Everything stays in sync** ✅

## 🔄 Updating Assets

### Update Individual Files
```bash
# Upload just CSS
npm run upload-css

# Upload all assets
npm run upload-assets
```

### Manual Upload (if needed)
```bash
# Navigate to project directory
cd /Users/tomerpoplavski/Downloads/martiCMS

# Upload specific file
node -e "
import { uploadFile } from './lib/spaces.js';
import fs from 'fs';
const content = fs.readFileSync('./public/styles.css', 'utf8');
uploadFile('assets/styles.css', content, 'text/css').then(console.log);
"
```

## 🎨 Asset Features

### CSS Features
- ✅ Apple HIG 2024 compliant design
- ✅ Responsive mobile-first design
- ✅ Dark mode support
- ✅ Glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Accessibility features

### Header Features
- ✅ Responsive hamburger menu
- ✅ MartiDeals branding with CDN logo
- ✅ Mobile-optimized navigation
- ✅ Smooth animations
- ✅ Accessibility support

### Footer Features
- ✅ Complete site navigation
- ✅ Legal compliance links (CCPA, Privacy, etc.)
- ✅ Cookie consent banner
- ✅ Responsive design
- ✅ MartiDeals branding

## 🔧 Customization

### Modify CSS Variables
Edit `/public/styles.css` and look for the `:root` section to customize:
```css
:root {
  --color-primary: #3C3C43;
  --color-secondary: #5AC8FA;
  /* Add your custom variables */
}
```

### Update Navigation Links
Edit `/public/header.html` and `/public/footer.html` to modify navigation links.

### Add Custom Scripts
Footer includes cookie consent functionality. Add your tracking scripts in the `acceptCookies()` function.

## 📱 Mobile Optimization

All assets are optimized for mobile:
- Hamburger menu appears on screens < 768px
- Touch-friendly button sizes (44px minimum)
- Responsive typography and spacing
- Optimized for iOS Safari and Android Chrome

## 🔒 Security & Privacy

- CCPA compliance built-in
- Cookie consent management
- Privacy policy integration
- Secure CDN delivery with HTTPS

## 🚨 Cache Management

Assets are cached with appropriate headers:
- CSS: 1 hour cache (`max-age=3600`)
- HTML: No cache for dynamic updates
- Images: 1 hour cache

To force cache refresh, the system automatically appends version parameters (`?v=timestamp`).

## 📊 Performance

- Minified CSS for faster loading
- CDN delivery for global performance
- Optimized images and assets
- Lazy loading where appropriate

## 🆘 Troubleshooting

### Assets Not Loading
1. Check CDN URLs are accessible
2. Verify CORS settings if loading from different domain
3. Check browser console for errors

### Styling Issues
1. Ensure CSS is loaded before content
2. Check for CSS conflicts with existing styles
3. Verify viewport meta tag is present

### Mobile Menu Not Working
1. Ensure JavaScript is enabled
2. Check for JavaScript errors in console
3. Verify hamburger menu CSS classes are present

---

**Need help?** Check the console logs or contact support.
