import { processCTAUrl } from './url-utils'
import { getPureStaticABTestingScript } from './ab-testing-frontend-only'
import { prisma } from './prisma'
import { uploadFile } from './spaces'

interface ArticleData {
  id?: string
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

export async function generateHTML(article: ArticleData): Promise<string> {
  const content = article.content as any
  const currentYear = new Date().getFullYear()
  
  // Fetch active variants for this article
  let embeddedVariants: any[] = []
  if (article.id) {
    try {
      const variants = await prisma.articleVariant.findMany({
        where: { 
          articleId: article.id,
          isActive: true
        },
        include: {
          template: {
            select: {
              id: true,
              name: true,
              category: true,
              placeholders: true,
              htmlContent: true
            }
          }
        },
        orderBy: [
          { isControl: 'desc' },
          { createdAt: 'asc' }
        ]
      })
      embeddedVariants = variants
    } catch (error) {
      console.error('Error fetching variants for HTML generation:', error)
    }
  }
  
  // Serialize variants for embedding in HTML (escape for safe HTML embedding)
  const variantsJson = JSON.stringify(embeddedVariants, null, 0)
  
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
    
    <!-- AB Testing Logic in Header (Early Loading) -->
    ${article.id ? `
    <script>
      console.log('🚀 AB Testing Header - Article ID: ${article.id}, Slug: ${article.slug}');
      
      // Global AB Testing Data
      window.abTestData = {
        articleId: '${article.id}',
        articleSlug: '${article.slug}',
        currentTest: null,
        currentVariant: null,
        isReady: false,
        embeddedVariants: []
      };

      // Extract ALL URL parameters and tracking data - no limitations
      function getTrackingParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const trackingData = {};
        
        // Parse ALL URL parameters - no filtering
        for (const [key, value] of urlParams.entries()) {
          trackingData[key] = value;
        }
        
        // Add referrer information
        if (document.referrer) {
          trackingData.page_referrer = document.referrer;
          try {
            const referrerUrl = new URL(document.referrer);
            trackingData.referrer_domain = referrerUrl.hostname;
          } catch (e) {}
        }
        
        // Add page information
        trackingData.page_url = window.location.href;
        trackingData.page_path = window.location.pathname;
        trackingData.page_title = document.title;
        
        // Add hash parameters if present
        if (window.location.hash) {
          trackingData.page_hash = window.location.hash;
          
          // Parse hash parameters (format: #param1=value1&param2=value2)
          if (window.location.hash.includes('=')) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            for (const [key, value] of hashParams.entries()) {
              trackingData['hash_' + key] = value;
            }
          }
        }
        
        return trackingData;
      }

      // Enhanced analytics tracking with all URL parameters
      function trackEvent(eventName, properties) {
        const trackingParams = getTrackingParameters();
        const fullProperties = {
          ...trackingParams,
          timestamp: new Date().toISOString(),
          ...properties
        };
        
        console.log('📊 Event tracked:', eventName, fullProperties);
        
        // Try Mixpanel if available
        if (typeof window.mixpanel !== 'undefined' && window.mixpanel.track) {
          try {
            window.mixpanel.track(eventName, fullProperties);
          } catch (error) {
            console.log('Mixpanel tracking failed, using console only');
          }
        }
        
        // Store in localStorage for debugging
        const events = JSON.parse(localStorage.getItem('ab_test_events') || '[]');
        events.push({ eventName, properties: fullProperties, timestamp: new Date().toISOString() });
        localStorage.setItem('ab_test_events', JSON.stringify(events.slice(-100)));
      }

      // URL utility functions for martideals redirect processing
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

      // Template rendering function
      function renderTemplate(templateHtml, data) {
        let rendered = templateHtml;
        
        // Replace all placeholders with actual data
        Object.keys(data).forEach(key => {
          const placeholder = new RegExp('{{' + key + '}}', 'g');
          let value = data[key] || '';
          
          // Process CTA URLs through martideals redirect system
          if (key.toLowerCase() === 'ctaurl' && value) {
            const adId = extractAdIdFromUrl(window.location.href);
            value = createRedirectUrl(value, adId);
          }
          
          rendered = rendered.replace(placeholder, value);
        });
        
        return rendered;
      }

      // Random variant assignment
      function assignVariant(variants) {
        const randomValue = Math.random() * 100;
        console.log('🎲 Random value generated:', randomValue.toFixed(2));
        
        let cumulative = 0;
        for (const variant of variants) {
          cumulative += variant.trafficPercent;
          if (randomValue < cumulative) {
            console.log('🎯 Randomly assigned variant:', variant.name, 'Random:', randomValue.toFixed(2));
            return variant;
          }
        }
        
        // Fallback to first variant
        console.log('🔄 Fallback to first variant');
        return variants[0];
      }

          // Load and apply AB test variants
          async function initializeABTesting() {
            try {
              console.log('🚀 Initializing AB Testing (100% serverless)...');

              // Load AB test data from CDN (100% serverless) with better cache busting
              const cdnUrl = 'https://daily.get.martideals.com/' + window.abTestData.articleSlug + '/ab-tests.json?v=' + Date.now();
              console.log('📂 Loading A/B test from CDN:', cdnUrl);

              const response = await fetch(cdnUrl);
              if (response.ok) {
                const data = await response.json();
                console.log('📊 A/B test data loaded from CDN:', data);

                if (data.tests && data.tests.length > 0) {
                  const test = data.tests[0];
                  window.abTestData.currentTest = test;
                  console.log('🧪 Active test found:', test.name);
                  console.log('🔍 Test variants:', test.variants.length);

                  // Filter active variants
                  const activeVariants = test.variants.filter(v => v.trafficPercent > 0);
                  console.log('✅ Active variants:', activeVariants.length);

                  if (activeVariants.length > 0) {
                    // Assign variant
                    const variant = assignVariant(activeVariants);
                    window.abTestData.currentVariant = variant;

                    console.log('🎯 Final assigned variant:', variant.name, variant.isControl ? '(Control)' : '(Test Variant)');
                    console.log('📦 Variant has template:', !!variant.template);
                    console.log('📦 Variant has data:', !!variant.data && Object.keys(variant.data).length > 0);

                    // Apply variant content when DOM is ready
                    function applyVariantWhenReady() {
                      if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => {
                          setTimeout(applyVariantContent, 50);
                        });
                      } else {
                        setTimeout(applyVariantContent, 50);
                      }
                    }
                    
                    applyVariantWhenReady();

                    // Track variant view
                    trackEvent('Variant Viewed', {
                      test_id: test.id,
                      test_name: test.name,
                      variant_id: variant.id,
                      variant_name: variant.name,
                      article_id: window.abTestData.articleId,
                      article_slug: window.abTestData.articleSlug,
                      is_control: variant.isControl,
                      traffic_percent: variant.trafficPercent,
                      template_id: variant.template ? variant.template.id : null,
                      timestamp: new Date().toISOString()
                    });
                  } else {
                    console.log('📝 No active variants found in test');
                  }
                } else {
                  console.log('📝 No tests found in CDN data');
                }
              } else {
                console.log('📝 No A/B test file found on CDN (HTTP', response.status, ') - this is normal if no AB tests are active');
              }

              window.abTestData.isReady = true;
              console.log('✅ A/B testing initialization complete!');
              
              // Show content after A/B testing is complete
              showArticleContent();
              
              // Ensure content is properly centered
              ensureContentCentering();

            } catch (error) {
              console.log('❌ A/B test error:', error.message);
              window.abTestData.isReady = true;
              
              // Show content even if A/B testing fails
              showArticleContent();
              
              // Ensure content is properly centered
              ensureContentCentering();
            }
          }

          // Apply variant content to the page
          function applyVariantContent() {
            const variant = window.abTestData.currentVariant;
            if (!variant) {
              console.log('📝 No variant selected - using original content');
              return;
            }

            console.log('🎨 Applying variant content:', variant.name, variant.isControl ? '(Control)' : '(Test)');
            console.log('📦 Variant data:', JSON.stringify(variant, null, 2));

            // Try multiple selectors to find the article container
            let mainContent = document.querySelector('main .article-container') ||
                              document.querySelector('.main-content .article-container') ||
                              document.querySelector('main article') ||
                              document.querySelector('.article-container') ||
                              document.querySelector('article');
            
            if (!mainContent) {
              console.warn('⚠️ Could not find article container element. Tried: main .article-container, .main-content .article-container, main article, .article-container, article');
              // Try again after a short delay in case DOM isn't fully ready
              setTimeout(() => {
                mainContent = document.querySelector('main .article-container') ||
                              document.querySelector('.main-content .article-container') ||
                              document.querySelector('main article') ||
                              document.querySelector('.article-container') ||
                              document.querySelector('article');
                if (mainContent && variant) {
                  console.log('✅ Found article container on retry');
                  applyVariantToElement(mainContent, variant);
                } else {
                  console.error('❌ Still could not find article container after retry');
                }
              }, 100);
              return;
            }
            
            applyVariantToElement(mainContent, variant);
          }
          
          // Helper function to apply variant to element
          function applyVariantToElement(element, variant) {
            if (!element || !variant) return;

            console.log('🎨 Applying variant to element:', variant.name, variant.isControl ? '(Control)' : '(Test)');
            console.log('📦 Variant changes:', JSON.stringify(variant.changes, null, 2));

            // NEW: Template-based content replacement (applies to ALL variants, including control)
            if (variant.template && variant.template.htmlContent && variant.data) {
              console.log('✅ Using template:', variant.template.name);
              const renderedContent = renderTemplate(variant.template.htmlContent, variant.data);
              element.innerHTML = renderedContent;
              console.log('✅ Replaced main content with template:', variant.template.name);
              return; // Template takes precedence
            }

            // If variant has data but no template, try to render basic content from data
            if (variant.data && Object.keys(variant.data).length > 0) {
              let htmlContent = '';
              
              // Build HTML from variant data
              if (variant.data.title) {
                htmlContent += '<h1>' + escapeHtml(variant.data.title) + '</h1>';
              }
              
              if (variant.data.image || variant.data.featuredImage) {
                const imageUrl = variant.data.image || variant.data.featuredImage;
                htmlContent += '<div class="featured-image"><img src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(variant.data.title || '') + '" /></div>';
              }
              
              if (variant.data.description) {
                htmlContent += '<p class="description">' + escapeHtml(variant.data.description) + '</p>';
              }
              
              if (variant.data.cta || variant.data.ctaText) {
                const ctaText = variant.data.cta || variant.data.ctaText;
                let ctaUrl = variant.data.ctaUrl || variant.data.url || '#';
                
                // Process CTA URL through martideals redirect system
                if (ctaUrl && ctaUrl !== '#') {
                  const adId = extractAdIdFromUrl(window.location.href);
                  ctaUrl = createRedirectUrl(ctaUrl, adId);
                }
                
                htmlContent += '<a href="' + escapeHtml(ctaUrl) + '" class="btn btn-primary">' + escapeHtml(ctaText) + '</a>';
              }
              
              if (htmlContent) {
                element.innerHTML = htmlContent;
                console.log('✅ Replaced main content with data-based HTML');
                return;
              }
            }

            // NEW: Handle simple changes (like title changes from simple A/B tests)
            if (variant.changes && Object.keys(variant.changes).length > 0) {
              console.log('🔧 Applying simple changes:', variant.changes);
              
              // Apply title changes
              if (variant.changes.title) {
                const h1 = element.querySelector('h1') || document.querySelector('h1');
                if (h1) {
                  h1.textContent = variant.changes.title;
                  console.log('✅ Updated H1 title to:', variant.changes.title);
                }
                // Also update document title
                document.title = variant.changes.title;
                console.log('✅ Updated document title to:', variant.changes.title);
              }

              // Apply meta title
              if (variant.changes.metaTitle) {
                document.title = variant.changes.metaTitle;
                const ogTitle = document.querySelector('meta[property="og:title"]');
                if (ogTitle) ogTitle.setAttribute('content', variant.changes.metaTitle);
                console.log('✅ Updated meta title to:', variant.changes.metaTitle);
              }

              // Apply meta description
              if (variant.changes.metaDescription) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute('content', variant.changes.metaDescription);
                const ogDesc = document.querySelector('meta[property="og:description"]');
                if (ogDesc) ogDesc.setAttribute('content', variant.changes.metaDescription);
                console.log('✅ Updated meta description');
              }

              // Apply featured image
              if (variant.changes.featuredImage) {
                const featuredImgs = element.querySelectorAll('.featured-image img, .hero-image img') || 
                                   document.querySelectorAll('.featured-image img, .hero-image img');
                featuredImgs.forEach(img => {
                  img.src = variant.changes.featuredImage;
                  console.log('✅ Updated featured image');
                });
              }

              // Apply CTA changes
              if (variant.changes.ctaText || variant.changes.ctaColor || variant.changes.ctaPosition) {
                const ctaButtons = element.querySelectorAll('.cta-button, .btn-primary, .buy-button') ||
                                 document.querySelectorAll('.cta-button, .btn-primary, .buy-button');
                ctaButtons.forEach(btn => {
                  if (variant.changes.ctaText) {
                    btn.textContent = variant.changes.ctaText;
                    console.log('✅ Updated CTA text to:', variant.changes.ctaText);
                  }
                  if (variant.changes.ctaColor) {
                    btn.style.backgroundColor = variant.changes.ctaColor;
                    btn.style.borderColor = variant.changes.ctaColor;
                    console.log('✅ Updated CTA color to:', variant.changes.ctaColor);
                  }
                });
              }

              // Apply custom CSS
              if (variant.changes.customCSS) {
                const style = document.createElement('style');
                style.textContent = variant.changes.customCSS;
                document.head.appendChild(style);
                console.log('✅ Applied custom CSS');
              }

              // Apply custom HTML
              if (variant.changes.customHTML) {
                const customDiv = document.createElement('div');
                customDiv.className = 'ab-test-custom-content';
                customDiv.innerHTML = variant.changes.customHTML;
                element.appendChild(customDiv);
                console.log('✅ Added custom HTML');
              }

              console.log('✅ Successfully applied variant changes');
              return;
            }

            // If control variant without template, data, or changes, keep original content
            if (variant.isControl && !variant.template && (!variant.data || Object.keys(variant.data).length === 0) && (!variant.changes || Object.keys(variant.changes).length === 0)) {
              console.log('📝 Control variant without template/data/changes - keeping original content');
              return;
            }
            
            console.warn('⚠️ Variant has no template, data, or changes to display. Variant:', JSON.stringify(variant, null, 2));
          }
          
          // Helper function to escape HTML
          function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          }

          // Show article content with smooth transition
          function showArticleContent() {
            const articleContainer = document.querySelector('.article-container');
            if (articleContainer) {
              articleContainer.classList.add('ab-ready');
              console.log('✅ Article content revealed');
            }
          }

          // Ensure content is properly centered
          function ensureContentCentering() {
            const articleContainer = document.querySelector('.article-container');
            if (articleContainer) {
              // Force center alignment on all content
              articleContainer.style.textAlign = 'center';
              articleContainer.style.margin = '0 auto';
              articleContainer.style.maxWidth = '800px';
              
              // Center all child elements
              const allElements = articleContainer.querySelectorAll('*');
              allElements.forEach(el => {
                if (el.tagName !== 'IMG') { // Don't center images as they have their own styling
                  el.style.textAlign = 'center';
                }
              });
              
              console.log('✅ Content centering applied');
            }
          }

      // Expose tracking function globally with full parameter tracking
      window.abTestTrackConversion = function(conversionType, eventData) {
        if (!window.abTestData.currentTest || !window.abTestData.currentVariant) return;
        
        trackEvent('Conversion', {
          test_id: window.abTestData.currentTest.id,
          test_name: window.abTestData.currentTest.name,
          variant_id: window.abTestData.currentVariant.id,
          variant_name: window.abTestData.currentVariant.name,
          conversion_type: conversionType || 'default',
          article_id: window.abTestData.articleId,
          article_slug: window.abTestData.articleSlug,
          is_control: window.abTestData.currentVariant.isControl,
          traffic_percent: window.abTestData.currentVariant.trafficPercent,
          ...eventData
        });
        
        console.log('🎯 Conversion tracked:', conversionType);
      };

      // Start AB testing
      initializeABTesting();
      
      // Fallback: show content after 2 seconds if A/B testing is taking too long
      setTimeout(function() {
        if (!window.abTestData.isReady) {
          console.log('⏰ A/B testing timeout - showing content anyway');
          const articleContainer = document.querySelector('.article-container');
          if (articleContainer && !articleContainer.classList.contains('ab-ready')) {
            articleContainer.classList.add('ab-fallback');
            ensureContentCentering();
          }
        }
      }, 2000);
    </script>
    ` : ''}
    
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
    <!-- AB Testing Version Marker -->
    <meta name="ab-testing-version" content="${Date.now()}">
    
    <!-- Hide content until A/B testing is complete -->
    <style>
      .article-container {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .article-container.ab-ready {
        opacity: 1;
      }
      /* Fallback: show content after 2 seconds if A/B testing fails */
      .article-container.ab-fallback {
        opacity: 1;
      }
    </style>
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
        <div class="container">
            <article class="article-container">
                ${renderArticleContent(content, article)}
            </article>
        </div>
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
    
    <!-- Analytics Loading (Footer) -->
    ${article.id ? `
    <script>
      // Load Mixpanel asynchronously (non-blocking)
      (function() {
        const script = document.createElement('script');
        script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
        script.async = true;
        script.onload = function() {
          console.log('📦 Mixpanel script loaded');
          if (typeof window.mixpanel !== 'undefined' && window.mixpanel.init) {
            try {
              window.mixpanel.init('e474bceac7e0d60bc3c4cb27aaf1d4f7', {
                debug: false,
                track_pageview: false,
                persistence: 'localStorage',
              });
              console.log('✅ Mixpanel initialized (footer)');
            } catch (error) {
              console.log('❌ Mixpanel initialization failed:', error);
            }
          }
        };
        script.onerror = function() {
          console.log('❌ Failed to load Mixpanel script - continuing without it');
        };
        document.head.appendChild(script);
      })();
    </script>
    ` : ''}
    
    <!-- CCPA Cookie Consent Banner -->
    <div id="cookie-banner" class="cookie-banner" style="display: none;">
        <div class="cookie-banner-content">
            <div class="cookie-info">
                <h3>🍪 We Value Your Privacy</h3>
                <p>
                    We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                    By continuing to use this site, you consent to our use of cookies and sharing of technical data with partners for analytics and service improvements.
                    <br><br>
                    California residents have additional <a href="https://daily.get.martideals.com/assets/ccpa-privacy-rights.html" class="privacy-link">CCPA privacy rights</a>.
                </p>
            </div>
            <div class="cookie-actions">
                <button onclick="acceptCookies()" class="btn btn-primary btn-small">Accept All</button>
                <button onclick="rejectCookies()" class="btn btn-outlined btn-small">Reject All</button>
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
  if (!content) {
    return `<h1>${article.title}</h1><p>Content will be loaded from variants...</p>`
  }
  
  const { contentType } = content
  
  if (contentType === 'single_product') {
    return renderSingleProduct(content, article)
  } else if (contentType === 'multiple_products') {
    return renderMultipleProducts(content, article)
  } else if (contentType === 'template_based') {
    // Template-based content - show title only, content will be loaded by variants
    return `<h1>${article.title}</h1>`
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
        ${product?.productLink ? `
        <a href="${processCTAUrl(product.productLink)}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">
          <img src="${article.featuredImage}" alt="${article.title}" style="cursor: pointer;" />
        </a>
        ` : `
        <img src="${article.featuredImage}" alt="${article.title}" />
        `}
      </div>
      ` : ''}
      
      ${product?.productLink ? `
      <h1 class="article-title">
        <a href="${processCTAUrl(product.productLink)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; cursor: pointer;">${article.title}</a>
      </h1>
      ` : `
      <h1 class="article-title">${article.title}</h1>
      `}
      
      ${product?.productLink ? `
      <div class="article-content" style="cursor: pointer;" onclick="window.open('${processCTAUrl(product.productLink)}', '_blank')">
        ${product?.description || ''}
      </div>
      ` : `
      <div class="article-content">
        ${product?.description || ''}
      </div>
      `}
      
      ${product?.productLink ? `
      <div class="product-cta-container" style="cursor: pointer;" onclick="window.open('${processCTAUrl(product.productLink)}', '_blank')">
        <div class="urgency-banner">
          <span class="urgency-text">🔥 LIMITED TIME OFFER - ACT NOW!</span>
        </div>
        <div class="cta-button-wrapper">
          <a href="${processCTAUrl(product.productLink)}" class="btn-primary cta-pulse" target="_blank" rel="noopener noreferrer">
            ${product.ctaText || '🛒 GET THIS DEAL NOW'} →
          </a>
        </div>
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
  const firstProductLink = products && products[0]?.productLink
  
  return `
    <div class="multiple-products-layout">
      ${article.featuredImage ? `
      <div class="featured-image">
        ${firstProductLink ? `
        <a href="${processCTAUrl(firstProductLink)}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">
          <img src="${article.featuredImage}" alt="${article.title}" style="cursor: pointer;" />
        </a>
        ` : `
        <img src="${article.featuredImage}" alt="${article.title}" />
        `}
      </div>
      ` : ''}
      
      ${firstProductLink ? `
      <h1 class="article-title">
        <a href="${processCTAUrl(firstProductLink)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; cursor: pointer;">${article.title}</a>
      </h1>
      ` : `
      <h1 class="article-title">${article.title}</h1>
      `}
      
      ${firstProductLink ? `
      <div class="article-intro" style="cursor: pointer;" onclick="window.open('${processCTAUrl(firstProductLink)}', '_blank')">
        ${content.intro || ''}
      </div>
      ` : `
      <div class="article-intro">
        ${content.intro || ''}
      </div>
      `}
      
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
      
      ${article.canonicalUrl ? `
      <div class="article-body" style="cursor: pointer;" onclick="window.open('${article.canonicalUrl}', '_blank')">
        ${content.body || ''}
      </div>
      ` : `
      <div class="article-body">
        ${content.body || ''}
      </div>
      `}
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
      padding: 40px 20px;
      text-align: center;
    }
    
    .featured-image {
      width: 100%;
      margin-bottom: 32px;
      border-radius: 8px;
      overflow: hidden;
      text-align: center;
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
      margin-bottom: 32px;
      color: #1d1d1f;
      line-height: 1.2;
      text-align: center;
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
      text-align: center;
    }
    
    .article-content[onclick],
    .article-intro[onclick],
    .article-body[onclick] {
      transition: opacity 0.2s ease;
    }
    
    .article-content[onclick]:hover,
    .article-intro[onclick]:hover,
    .article-body[onclick]:hover {
      opacity: 0.8;
    }
    
    .article-content p,
    .article-body p {
      margin-bottom: 16px;
      text-align: center;
    }
    
    .article-content *,
    .article-intro *,
    .article-body * {
      text-align: center;
    }
    
    .single-product-layout,
    .multiple-products-layout,
    .blog-article-layout {
      text-align: center;
    }
    
    .product-cta-container {
      text-align: center;
      margin: 32px auto;
      max-width: 600px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      padding: 24px;
      border-radius: 12px;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
    }
    
    .product-cta-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      border-color: #0071e3;
    }
    
    .urgency-banner {
      margin-bottom: 16px;
    }
    
    .urgency-text {
      background: linear-gradient(135deg, #ff6b6b, #ff8e53);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
    }
    
    .cta-button-wrapper {
      margin: 20px 0;
    }
    
    .cta-subtext {
      margin-top: 16px;
      font-size: 14px;
      color: #6e6e73;
      font-weight: 500;
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
    
    .cta-pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 113, 227, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(0, 113, 227, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 113, 227, 0);
      }
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      justify-content: center;
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
      text-align: center;
    }
    
    .product-card {
      background: #f5f5f7;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      text-align: center;
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
      text-align: center;
    }
    
    .product-title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1d1d1f;
      text-align: center;
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
      text-align: center;
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
        padding: 24px 16px;
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

