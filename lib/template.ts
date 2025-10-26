import { processCTAUrl } from './url-utils'

interface ArticleData {
  title: string
  metaTitle?: string
  metaDescription?: string
  author: string
  featuredImage?: string
  content: any
  keywords?: string[]
  canonicalUrl?: string
  facebookPixel?: string
  customScripts?: string
  slug: string
  publishedAt?: string
}

export function generateHTML(article: ArticleData): string {
  const content = article.content as any
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
    
    <title>${article.metaTitle || article.title}</title>
    <meta name="description" content="${article.metaDescription || ''}" />
    ${article.keywords && article.keywords.length > 0 ? `<meta name="keywords" content="${article.keywords.join(', ')}" />` : ''}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${article.metaTitle || article.title}" />
    <meta property="og:description" content="${article.metaDescription || ''}" />
    ${article.featuredImage ? `<meta property="og:image" content="${article.featuredImage}" />` : ''}
    ${article.canonicalUrl ? `<meta property="og:url" content="${article.canonicalUrl}" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.metaTitle || article.title}" />
    <meta name="twitter:description" content="${article.metaDescription || ''}" />
    ${article.featuredImage ? `<meta name="twitter:image" content="${article.featuredImage}" />` : ''}
    
    ${article.canonicalUrl ? `<link rel="canonical" href="${article.canonicalUrl}" />` : ''}
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${article.title}",
      "author": {
        "@type": "Person",
        "name": "${article.author}"
      },
      ${article.featuredImage ? `"image": "${article.featuredImage}",` : ''}
      ${article.publishedAt ? `"datePublished": "${article.publishedAt}",` : ''}
      "description": "${article.metaDescription || ''}"
    }
    </script>
    
    <!-- Facebook Pixel Placeholder -->
    ${article.facebookPixel ? `
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${article.facebookPixel}');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${article.facebookPixel}&ev=PageView&noscript=1"
    /></noscript>
    ` : '<!-- Facebook Pixel: Add your pixel ID in CMS -->'}
    
    <!-- Custom Scripts Placeholder -->
    ${article.customScripts || '<!-- Custom scripts: Add in CMS -->'}
    
    <!-- Dynamic URL Processing Script -->
    <script>
      // URL utilities for dynamic redirect processing
      function encodeUrlToBase64(url) {
        return btoa(url);
      }
      
      function extractAdIdFromUrl(currentUrl) {
        try {
          const url = new URL(currentUrl);
          return url.searchParams.get('ad_id');
        } catch (error) {
          console.warn('Failed to parse URL for ad_id extraction:', currentUrl);
          return null;
        }
      }
      
      function createRedirectUrl(originalUrl, adId) {
        const redirectId = adId || 'default';
        const encodedUrl = encodeUrlToBase64(originalUrl);
        return 'https://www.martideals.com/partners/url-deep-redirect?url=' + encodedUrl + '&redirectId=' + redirectId;
      }
      
      // Update all CTA links with dynamic ad_id when page loads
      document.addEventListener('DOMContentLoaded', function() {
        const adId = extractAdIdFromUrl(window.location.href);
        
        if (adId) {
          // Find all CTA links and update them with the current ad_id
          const ctaLinks = document.querySelectorAll('a.btn-primary, a.btn-secondary');
          
          ctaLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            
            // Check if it's already a redirect URL (contains martideals.com)
            if (href && href.includes('martideals.com/partners/url-deep-redirect')) {
              // Extract the original URL from the existing redirect
              const urlMatch = href.match(/url=([^&]+)/);
              if (urlMatch) {
                try {
                  const originalUrl = atob(urlMatch[1]);
                  // Update with current ad_id
                  link.setAttribute('href', createRedirectUrl(originalUrl, adId));
                } catch (e) {
                  console.warn('Failed to decode existing redirect URL:', href);
                }
              }
            }
          });
          
          console.log('Updated CTA links with ad_id:', adId);
        }
      });
    </script>
    
    <style>
        ${getInlineStyles()}
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav>
                <!-- Navigation can be customized -->
            </nav>
        </div>
    </header>

    <main class="main-content">
        <article class="article-container">
            ${renderArticleContent(content, article)}
        </article>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
}

function renderArticleContent(content: any, article: ArticleData): string {
  const { contentType } = content
  
  if (contentType === 'single_product') {
    return renderSingleProduct(content, article)
  } else if (contentType === 'multiple_products') {
    return renderMultipleProducts(content, article)
  } else {
    return renderBlogArticle(content, article)
  }
}

function renderSingleProduct(content: any, article: ArticleData): string {
  const { product } = content
  
  return `
    <div class="single-product-layout">
      ${article.featuredImage ? `
      <div class="featured-image">
        <img src="${article.featuredImage}" alt="${article.title}" />
      </div>
      ` : ''}
      
      <h1 class="article-title">${article.title}</h1>
      
      <div class="article-meta">
        <span class="author">By ${article.author}</span>
        ${article.publishedAt ? `<span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>` : ''}
      </div>
      
      <div class="article-content">
        ${product?.description || ''}
      </div>
      
      ${product?.productLink ? `
      <div class="product-cta">
        <a href="${processCTAUrl(product.productLink)}" class="btn-primary" target="_blank" rel="noopener noreferrer">
          ${product.ctaText || 'View Product'} →
        </a>
      </div>
      ` : ''}
      
      ${product?.rating ? `
      <div class="product-rating">
        <span class="stars">${'⭐'.repeat(product.rating)}</span>
        ${product.reviewCount ? `<span class="reviews">(${product.reviewCount} reviews)</span>` : ''}
      </div>
      ` : ''}
    </div>
  `
}

function renderMultipleProducts(content: any, article: ArticleData): string {
  const { products } = content
  
  return `
    <div class="multiple-products-layout">
      ${article.featuredImage ? `
      <div class="featured-image">
        <img src="${article.featuredImage}" alt="${article.title}" />
      </div>
      ` : ''}
      
      <h1 class="article-title">${article.title}</h1>
      
      <div class="article-meta">
        <span class="author">By ${article.author}</span>
        ${article.publishedAt ? `<span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>` : ''}
      </div>
      
      <div class="article-intro">
        ${content.intro || ''}
      </div>
      
      <div class="products-grid">
        ${(products || []).map((product: any, index: number) => `
          <div class="product-card">
            ${product.image ? `
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}" />
            </div>
            ` : ''}
            
            <div class="product-info">
              <h3 class="product-title">${index + 1}. ${product.title}</h3>
              <p class="product-description">${product.description || ''}</p>
              
              ${product.rating ? `
              <div class="product-rating">
                <span class="stars">${'⭐'.repeat(product.rating)}</span>
              </div>
              ` : ''}
              
              ${product.productLink ? `
              <a href="${processCTAUrl(product.productLink)}" class="btn-secondary" target="_blank" rel="noopener noreferrer">
                View on Amazon →
              </a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderBlogArticle(content: any, article: ArticleData): string {
  return `
    <div class="blog-article-layout">
      ${article.featuredImage ? `
      <div class="featured-image">
        <img src="${article.featuredImage}" alt="${article.title}" />
      </div>
      ` : ''}
      
      <h1 class="article-title">${article.title}</h1>
      
      <div class="article-meta">
        <span class="author">By ${article.author}</span>
        ${article.publishedAt ? `<span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>` : ''}
      </div>
      
      <div class="article-body">
        ${content.body || ''}
      </div>
    </div>
  `
}

function getInlineStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f7;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .header {
      background: #fff;
      padding: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .main-content {
      padding: 40px 0;
    }
    
    .article-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }
    
    .featured-image {
      width: 100%;
      margin-bottom: 32px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .featured-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .article-title {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1d1d1f;
      line-height: 1.2;
    }
    
    .article-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      color: #6e6e73;
      font-size: 14px;
    }
    
    .article-content,
    .article-intro,
    .article-body {
      font-size: 18px;
      line-height: 1.8;
      color: #1d1d1f;
      margin-bottom: 32px;
    }
    
    .article-content p,
    .article-body p {
      margin-bottom: 16px;
    }
    
    .product-cta {
      text-align: center;
      margin: 32px 0;
    }
    
    .btn-primary,
    .btn-secondary {
      display: inline-block;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #0071e3;
      color: #fff;
    }
    
    .btn-primary:hover {
      background: #0077ed;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,113,227,0.3);
    }
    
    .btn-secondary {
      background: #f5f5f7;
      color: #0071e3;
      border: 1px solid #d2d2d7;
    }
    
    .btn-secondary:hover {
      background: #e8e8ed;
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0;
      font-size: 14px;
    }
    
    .stars {
      color: #FFB800;
      font-size: 18px;
    }
    
    .products-grid {
      display: grid;
      gap: 24px;
      margin-top: 32px;
    }
    
    .product-card {
      background: #f5f5f7;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    
    .product-image {
      width: 100%;
      height: 250px;
      overflow: hidden;
      background: #fff;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-info {
      padding: 24px;
    }
    
    .product-title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1d1d1f;
    }
    
    .product-description {
      font-size: 16px;
      line-height: 1.6;
      color: #6e6e73;
      margin-bottom: 16px;
    }
    
    .footer {
      background: #f5f5f7;
      padding: 40px 0;
      text-align: center;
      color: #6e6e73;
      font-size: 14px;
      margin-top: 60px;
    }
    
    @media (max-width: 768px) {
      .article-container {
        padding: 24px;
        border-radius: 0;
      }
      
      .article-title {
        font-size: 28px;
      }
      
      .article-content,
      .article-body {
        font-size: 16px;
      }
      
      .product-title {
        font-size: 20px;
      }
    }
  `
}

