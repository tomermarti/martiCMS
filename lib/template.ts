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
  const currentYear = new Date().getFullYear()
  
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
        return 'https://tracking.martideals.com/partners/url-deep-redirect?url=' + encodedUrl + '&redirectId=' + redirectId;
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
          
          // Update clickable containers with onclick handlers
          const clickableContainers = document.querySelectorAll('.product-cta[onclick], .product-card[onclick]');
          clickableContainers.forEach(function(container) {
            const onclickAttr = container.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('martideals.com/partners/url-deep-redirect')) {
              // Extract the original URL from the onclick attribute
              const urlMatch = onclickAttr.match(/url=([^&']+)/);
              if (urlMatch) {
                try {
                  const originalUrl = atob(urlMatch[1]);
                  // Update with current ad_id
                  const newRedirectUrl = createRedirectUrl(originalUrl, adId);
                  container.setAttribute('onclick', "window.open('" + newRedirectUrl + "', '_blank')");
                } catch (e) {
                  console.warn('Failed to decode existing redirect URL in onclick:', onclickAttr);
                }
              }
            }
          });
          
          console.log('Updated CTA links and clickable containers with ad_id:', adId);
        }
      });
    </script>
    
    <!-- CDN Stylesheet with Cache Busting -->
    <link rel="stylesheet" href="https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/assets/styles.css?v=${Date.now()}">
</head>
<body>
    <!-- Dynamic Header - Loaded from CDN -->
    <div id="dynamic-header"></div>
    
    <script>
      // Load dynamic header with version-based cache busting
      async function loadDynamicHeader() {
        // Try direct CDN first (skip version API for static sites)
        const directUrl = 'https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/assets/header.html?v=' + Date.now();
        
        try {
          console.log('Loading header from CDN:', directUrl);
          const response = await fetch(directUrl);
          
          if (response.ok) {
            const html = await response.text();
            document.getElementById('dynamic-header').innerHTML = html;
            
            // Initialize hamburger menu after header is loaded
            initializeHamburgerMenu();
            console.log('Header loaded successfully from CDN');
            return;
          }
        } catch (error) {
          console.warn('Failed to load header from CDN:', error);
        }
        
        // If CDN fails, try version API (for CMS environment)
        try {
          console.log('Trying version API fallback...');
          const versionResponse = await fetch('${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version');
          const versionData = await versionResponse.json();
          
          // Load header with version parameter
          const headerUrl = versionData.headerUrl || directUrl;
          const headerResponse = await fetch(headerUrl);
          const html = await headerResponse.text();
          
          document.getElementById('dynamic-header').innerHTML = html;
          
          // Initialize hamburger menu after header is loaded
          initializeHamburgerMenu();
          console.log('Header loaded from version API');
        } catch (error) {
          console.warn('Failed to load versioned header, using final fallback:', error);
          // Final fallback header with hamburger menu
          document.getElementById('dynamic-header').innerHTML = \`
            <header class="site-header">
              <div class="header-container">
                  <div class="header-brand">
                      <a href="https://www.martideals.com" class="brand-link">
                          <img src="https://daily.get.martideals.com/assets/martideals_logo.png" alt="MartiDeals Logo" class="brand-logo" />
                          MartiDeals
                      </a>
                  </div>
                  <button class="hamburger-menu" id="hamburger-btn" aria-label="Toggle navigation">
                      <span class="hamburger-line"></span>
                      <span class="hamburger-line"></span>
                      <span class="hamburger-line"></span>
                  </button>
                  <nav class="header-nav" id="mobile-nav">
                      <a href="https://www.martideals.com" class="nav-link">Home</a>
                      <a href="https://www.martideals.com/deals" class="nav-link">Deals</a>
                      <a href="https://www.martideals.com/about" class="nav-link">About</a>
                      <a href="https://www.martideals.com/contact" class="nav-link">Contact</a>
                  </nav>
              </div>
            </header>
          \`;
          
          // Initialize hamburger menu for fallback header
          initializeHamburgerMenu();
          console.log('Final fallback header loaded');
        }
      }
      
      // Hamburger menu initialization function
      function initializeHamburgerMenu() {
        const nav = document.getElementById('mobile-nav');
        const hamburger = document.getElementById('hamburger-btn');
        
        if (nav && hamburger) {
          console.log('Hamburger menu initialized');
          
          // Remove any existing listeners to avoid duplicates
          hamburger.replaceWith(hamburger.cloneNode(true));
          const newHamburger = document.getElementById('hamburger-btn');
          
          newHamburger.addEventListener('click', function() {
            console.log('Hamburger clicked!');
            nav.classList.toggle('active');
            newHamburger.classList.toggle('active');
            console.log('Nav active:', nav.classList.contains('active'));
          });
          
          return true;
        } else {
          console.warn('Hamburger menu elements not found:', { nav: !!nav, hamburger: !!hamburger });
          return false;
        }
      }
      
      // Load header when page loads
      loadDynamicHeader();
    </script>

    <main class="main-content">
        <article class="article-container">
            ${renderArticleContent(content, article)}
        </article>
    </main>

    <!-- Dynamic Footer - Loaded from CDN -->
    <div id="dynamic-footer"></div>
    
    <script>
      // Load dynamic footer with version-based cache busting
      async function loadDynamicFooter() {
        // Try direct CDN first (skip version API for static sites)
        const directUrl = 'https://${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}/assets/footer.html?v=' + Date.now();
        
        try {
          console.log('Loading footer from CDN:', directUrl);
          const response = await fetch(directUrl);
          
          if (response.ok) {
            const html = await response.text();
            document.getElementById('dynamic-footer').innerHTML = html;
            console.log('Footer loaded successfully from CDN');
            return;
          }
        } catch (error) {
          console.warn('Failed to load footer from CDN:', error);
        }
        
        // If CDN fails, try version API (for CMS environment)
        try {
          console.log('Trying footer version API fallback...');
          const versionResponse = await fetch('${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/layout/version');
          const versionData = await versionResponse.json();
          
          // Load footer with version parameter
          const footerUrl = versionData.footerUrl || directUrl;
          const footerResponse = await fetch(footerUrl);
          const html = await footerResponse.text();
          
          document.getElementById('dynamic-footer').innerHTML = html;
          console.log('Footer loaded from version API');
        } catch (error) {
          console.warn('Failed to load versioned footer, using final fallback:', error);
          // Fallback with timestamp
          const fallbackUrl = directUrl;
          try {
            const response = await fetch(fallbackUrl);
            const html = await response.text();
            document.getElementById('dynamic-footer').innerHTML = html;
          } catch (fallbackError) {
            console.warn('Failed to load dynamic footer:', fallbackError);
            // Final fallback footer - simple format with CCPA compliance
            document.getElementById('dynamic-footer').innerHTML = \`
              <footer class="site-footer">
                <div class="footer-container">
                    <!-- Editorial Note -->
                    <div class="editorial-note">
                        <p><strong>Editorial Note:</strong> We independently review all products. If you make a purchase through our links, we may receive a commission.</p>
                    </div>
                    
                    <!-- Opt-in Disclaimer -->
                    <div class="opt-in-disclaimer">
                        <p>By continuing to use this site, you consent to our use of cookies and sharing of technical data with partners for analytics and service improvements.</p>
                    </div>
                    <div class="footer-simple">
                        <a href="https://www.martideals.com/assets/privacy-policy.html">Privacy Policy</a>
                        <a href="https://www.martideals.com/assets/terms-of-service.html">Terms & Conditions</a>
                        <a href="https://www.martideals.com/assets/do-not-sell.html" class="ccpa-important">🔒 Do Not Sell My Personal Information</a>
                        <a href="https://www.martideals.com/assets/ccpa-privacy-rights.html">CCPA Privacy Rights</a>
                        <a href="https://www.martideals.com/cookie-policy">Cookie Policy</a>
                    </div>
                    <div class="footer-copyright">
                        <p>MartiDeals.com © 2025 All Rights Reserved</p>
                    </div>
                </div>
              </footer>
            \`;
            console.log('Final fallback footer loaded');
          }
        }
      }
      
      // Load footer when page loads
      loadDynamicFooter();
    </script>
    
    <!-- CCPA Cookie Consent Banner -->
    <div id="cookie-banner" class="cookie-banner" style="display: none;">
        <div class="cookie-banner-content">
            <div class="cookie-info">
                <h3>🍪 We Value Your Privacy</h3>
                <p>
                    We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                    By continuing to use this site, you consent to our use of cookies and sharing of technical data with partners for analytics and service improvements.
                    <br><br>
                    California residents have additional <a href="https://www.martideals.com/ccpa-privacy-rights" class="privacy-link">CCPA privacy rights</a>.
                </p>
            </div>
            <div class="cookie-actions">
                <button onclick="acceptCookies()" class="btn-primary btn-sm">Accept All</button>
                <button onclick="rejectCookies()" class="btn-outlined btn-sm">Reject All</button>
            </div>
        </div>
    </div>
    
    <script>
        // CCPA Cookie Consent Logic
        function showCookieBanner() {
            const consent = localStorage.getItem('cookie-consent');
            if (!consent) {
                document.getElementById('cookie-banner').style.display = 'block';
            }
        }
        
        function acceptCookies() {
            localStorage.setItem('cookie-consent', JSON.stringify({
                necessary: true,
                analytics: true,
                marketing: true,
                personalization: true
            }));
            localStorage.setItem('cookie-consent-date', new Date().toISOString());
            document.getElementById('cookie-banner').style.display = 'none';
        }
        
        function rejectCookies() {
            localStorage.setItem('cookie-consent', JSON.stringify({
                necessary: true,
                analytics: false,
                marketing: false,
                personalization: false
            }));
            localStorage.setItem('cookie-consent-date', new Date().toISOString());
            document.getElementById('cookie-banner').style.display = 'none';
        }
        
        // Show banner on page load
        document.addEventListener('DOMContentLoaded', function() {
            showCookieBanner();
        });
    </script>
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
        ${article.canonicalUrl ? `
        <a href="${article.canonicalUrl}" style="cursor: pointer;">
          <img src="${article.featuredImage}" alt="${article.title}" style="cursor: pointer;" />
        </a>
        ` : `
        <img src="${article.featuredImage}" alt="${article.title}" />
        `}
      </div>
      ` : ''}
      
      ${article.canonicalUrl ? `
      <h1 class="article-title">
        <a href="${article.canonicalUrl}" style="text-decoration: none; color: inherit; cursor: pointer;">${article.title}</a>
      </h1>
      ` : `
      <h1 class="article-title">${article.title}</h1>
      `}
      
      <div class="article-meta">
        <span class="author">By ${article.author}</span>
        ${article.publishedAt ? `<span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>` : ''}
      </div>
      
      <div class="article-content">
        ${product?.description || ''}
      </div>
      
      ${product?.productLink ? `
      <div class="product-cta" style="cursor: pointer;" onclick="window.open('${processCTAUrl(product.productLink)}', '_blank')">
        <div class="urgency-banner">
          <span class="urgency-text">🔥 LIMITED TIME OFFER - ACT NOW!</span>
        </div>
        <a href="${processCTAUrl(product.productLink)}" class="btn-primary cta-pulse" target="_blank" rel="noopener noreferrer">
          ${product.ctaText || '🛒 GET THIS DEAL NOW'} →
        </a>
        <div class="cta-subtext">
          ⚡ Don't miss out - prices may increase at any time!
        </div>
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
        ${article.canonicalUrl ? `
        <a href="${article.canonicalUrl}" style="cursor: pointer;">
          <img src="${article.featuredImage}" alt="${article.title}" style="cursor: pointer;" />
        </a>
        ` : `
        <img src="${article.featuredImage}" alt="${article.title}" />
        `}
      </div>
      ` : ''}
      
      ${article.canonicalUrl ? `
      <h1 class="article-title">
        <a href="${article.canonicalUrl}" style="text-decoration: none; color: inherit; cursor: pointer;">${article.title}</a>
      </h1>
      ` : `
      <h1 class="article-title">${article.title}</h1>
      `}
      
      <div class="article-meta">
        <span class="author">By ${article.author}</span>
        ${article.publishedAt ? `<span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>` : ''}
      </div>
      
      <div class="article-intro">
        ${content.intro || ''}
      </div>
      
      <div class="products-grid">
        ${(products || []).map((product: any, index: number) => `
          <div class="product-card" ${product.productLink ? `style="cursor: pointer;" onclick="window.open('${processCTAUrl(product.productLink)}', '_blank')"` : ''}>
            ${product.image ? `
            <div class="product-image">
              ${product.productLink ? `
              <a href="${processCTAUrl(product.productLink)}" target="_blank" rel="noopener noreferrer">
                <img src="${product.image}" alt="${product.title}" style="cursor: pointer;" />
              </a>
              ` : `
              <img src="${product.image}" alt="${product.title}" />
              `}
            </div>
            ` : ''}
            
            <div class="product-info">
              ${product.productLink ? `
              <h3 class="product-title">
                <a href="${processCTAUrl(product.productLink)}" style="text-decoration: none; color: inherit; cursor: pointer;" target="_blank" rel="noopener noreferrer">
                  ${index + 1}. ${product.title}
                </a>
              </h3>
              ` : `
              <h3 class="product-title">${index + 1}. ${product.title}</h3>
              `}
              <p class="product-description">${product.description || ''}</p>
              
              ${product.rating ? `
              <div class="product-rating">
                <span class="stars">${'⭐'.repeat(product.rating)}</span>
              </div>
              ` : ''}
              
              ${product.productLink ? `
              <a href="${processCTAUrl(product.productLink)}" class="btn-secondary cta-pulse" target="_blank" rel="noopener noreferrer">
                🛒 GRAB THIS DEAL NOW →
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
        ${article.canonicalUrl ? `
        <a href="${article.canonicalUrl}" style="cursor: pointer;">
          <img src="${article.featuredImage}" alt="${article.title}" style="cursor: pointer;" />
        </a>
        ` : `
        <img src="${article.featuredImage}" alt="${article.title}" />
        `}
      </div>
      ` : ''}
      
      ${article.canonicalUrl ? `
      <h1 class="article-title">
        <a href="${article.canonicalUrl}" style="text-decoration: none; color: inherit; cursor: pointer;">${article.title}</a>
      </h1>
      ` : `
      <h1 class="article-title">${article.title}</h1>
      `}
      
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
    
    .site-header {
      background: #fff;
      border-bottom: 1px solid rgba(60, 60, 67, 0.29);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    
    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      position: relative;
    }
    
    .header-brand {
      display: flex;
      align-items: center;
    }
    
    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #1d1d1f;
    }
    
    .brand-logo {
      height: 50px;
      width: auto;
    }
    
    .header-nav {
      display: flex;
      align-items: center;
      gap: 32px;
    }
    
    .nav-link {
      color: #1d1d1f;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    
    .nav-link:hover {
      background: rgba(120, 120, 128, 0.2);
      color: #3C3C43;
    }

    .hamburger-menu {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .hamburger-menu:hover {
      background: rgba(120, 120, 128, 0.2);
    }

    .hamburger-line {
      width: 24px;
      height: 2px;
      background: #1d1d1f;
      margin: 2px 0;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    .hamburger-menu.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger-menu.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .hamburger-menu.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
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
      transition: transform 0.2s ease;
    }
    
    .featured-image a:hover img {
      transform: scale(1.02);
    }
    
    .article-title {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1d1d1f;
      line-height: 1.2;
    }
    
    .article-title a:hover {
      opacity: 0.8;
      transition: opacity 0.2s ease;
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
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .product-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
    
    .product-title a:hover {
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    
    .product-description {
      font-size: 16px;
      line-height: 1.6;
      color: #6e6e73;
      margin-bottom: 16px;
    }
    
    .site-footer {
      background: #f2f2f7;
      border-top: 1px solid rgba(60, 60, 67, 0.29);
      margin-top: 60px;
    }
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      padding: 48px 0 32px 0;
    }
    
    .footer-section h4 {
      font-size: 18px;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 16px 0;
    }
    
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .footer-logo {
      height: 60px;
      width: auto;
      margin-bottom: 12px;
    }
    
    .footer-brand p {
      color: rgba(60, 60, 67, 0.6);
      line-height: 1.5;
      margin: 0;
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .footer-links a {
      color: rgba(60, 60, 67, 0.6);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links a:hover {
      color: #3C3C43;
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(60, 60, 67, 0.29);
      padding: 24px 0;
    }
    
    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .footer-bottom p {
      color: rgba(60, 60, 67, 0.6);
      margin: 0;
      font-size: 14px;
    }
    
    .ccpa-notice {
      display: flex;
      align-items: center;
    }
    
    .ccpa-link {
      color: #3C3C43;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid rgba(60, 60, 67, 0.2);
      transition: all 0.2s ease;
    }
    
    .ccpa-link:hover {
      background: rgba(60, 60, 67, 0.1);
      border-color: #3C3C43;
    }
    
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-top: 1px solid rgba(60, 60, 67, 0.29);
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    
    .cookie-banner-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    
    .cookie-info h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1d1d1f;
    }
    
    .cookie-info p {
      margin: 0;
      color: rgba(60, 60, 67, 0.6);
      line-height: 1.4;
      font-size: 14px;
    }
    
    .privacy-link {
      color: #3C3C43;
      text-decoration: underline;
    }
    
    .cookie-actions {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }
    
    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .btn-primary.btn-sm {
      background: #3C3C43;
      color: #fff;
    }
    
    .btn-primary.btn-sm:hover {
      background: #2C2C2F;
    }
    
    .btn-outlined.btn-sm {
      background: transparent;
      color: #3C3C43;
      border: 1px solid rgba(60, 60, 67, 0.2);
    }
    
    .btn-outlined.btn-sm:hover {
      background: rgba(60, 60, 67, 0.1);
    }
    
    @media (max-width: 768px) {
      .hamburger-menu {
        display: flex;
      }

      .header-nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border-top: 1px solid rgba(60, 60, 67, 0.29);
        flex-direction: column;
        padding: 16px 20px;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .header-nav.active {
        display: flex;
      }

      .header-nav .nav-link {
        padding: 12px 16px;
        border-radius: 8px;
        text-align: left;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 32px 0 24px 0;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
      
      .footer-section:first-child {
        text-align: center;
      }
      
      .cookie-banner-content {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        gap: 16px;
      }
      
      .cookie-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
      
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

