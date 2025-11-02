// Pure frontend A/B testing script - no server dependencies at all!
export function getPureStaticABTestingScript(articleId: string, articleSlug: string): string {
  return `
<!-- Pure Static A/B Testing - No Server Calls! -->
<script src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"></script>
<script>
  // Initialize Mixpanel
  mixpanel.init('e474bceac7e0d60bc3c4cb27aaf1d4f7', {
    debug: false,
    track_pageview: true,
    persistence: 'localStorage',
  });

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

  // Pure Static A/B Testing - Zero Server Dependencies!
  (function() {
    // Only run in browser, not during SSR
    if (typeof window === 'undefined') return;
    
    const articleId = '${articleId}';
    const articleSlug = '${articleSlug}';
    let currentTest = null;
    let currentVariant = null;

    // Get or create session ID
    function getSessionId() {
      if (typeof window === 'undefined') return 'ssr_session';
      
      let sessionId = localStorage.getItem('ab_session_id');
      if (!sessionId) {
        const timestamp = Math.floor(Date.now() / 1000); // Use seconds for stability
        const random = Math.random().toString(36).substr(2, 9);
        sessionId = 'session_' + timestamp + '_' + random;
        localStorage.setItem('ab_session_id', sessionId);
      }
      return sessionId;
    }

    // Get device type
    function getDeviceType() {
      if (typeof window === 'undefined') return 'unknown';
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }

    // Hash function for consistent variant assignment
    function hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    }

    // Assign variant based on traffic distribution
    function assignVariant(variants, sessionId, testId) {
      const storageKey = 'ab_test_' + testId + '_variant';
      const storedVariantId = localStorage.getItem(storageKey);
      
      if (storedVariantId) {
        const variant = variants.find(v => v.id === storedVariantId);
        if (variant) return variant;
      }

      const hash = hashString(sessionId + testId);
      const randomValue = (hash % 10000) / 100;
      
      let cumulative = 0;
      for (const variant of variants) {
        cumulative += variant.trafficPercent;
        if (randomValue < cumulative) {
          localStorage.setItem(storageKey, variant.id);
          return variant;
        }
      }
      
      const control = variants.find(v => v.isControl) || variants[0];
      localStorage.setItem(storageKey, control.id);
      return control;
    }

    // Apply template-based variant to the page
    function applyVariantTemplate(variant) {
      console.log('🎨 Applying variant content:', variant.name, '(Test)');
      console.log('📦 Variant data:', variant.data);
      console.log('📦 Variant changes:', variant.changes);
      
      if (!variant.template || !variant.template.htmlContent) {
        console.warn('⚠️ No template content found for variant');
        return;
      }
      
      console.log('✅ Using template:', variant.template.name);
      
      // Replace placeholders in template HTML
      let processedHTML = variant.template.htmlContent;
      
      if (variant.data && typeof variant.data === 'object') {
        // Replace all placeholders with actual data
        Object.keys(variant.data).forEach(key => {
          const placeholder = '{{' + key + '}}';
          const value = variant.data[key];
          processedHTML = processedHTML.replace(new RegExp(placeholder, 'g'), value);
        });
      }
      
      // Find the main content container and replace it
      const mainContent = document.querySelector('.article-container, .main-content .container, main .container, .content');
      if (mainContent) {
        mainContent.innerHTML = processedHTML;
        console.log('✅ Replaced main content with template:', variant.template.name);
        
        // Make content visible
        const articleContainer = document.querySelector('.article-container');
        if (articleContainer) {
          articleContainer.classList.add('ab-ready');
        }
      } else {
        console.warn('⚠️ Could not find main content container to replace');
        
        // Fallback: try to append to body
        const body = document.body;
        if (body) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = processedHTML;
          tempDiv.className = 'ab-test-template-content';
          body.appendChild(tempDiv);
          console.log('✅ Added template content to body as fallback');
        }
      }
    }

    // Apply variant changes to the page (backward compatibility)
    function applyVariantChanges(changes) {
      if (!changes || typeof changes !== 'object') return;

      console.log('🎨 Applying variant changes:', changes);

      // Apply title changes
      if (changes.title) {
        const h1 = document.querySelector('h1');
        if (h1) {
          h1.textContent = changes.title;
          console.log('✅ Updated H1 title');
        }
        document.title = changes.title;
      }

      // Apply meta title
      if (changes.metaTitle) {
        document.title = changes.metaTitle;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', changes.metaTitle);
        console.log('✅ Updated meta title');
      }

      // Apply meta description
      if (changes.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', changes.metaDescription);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', changes.metaDescription);
        console.log('✅ Updated meta description');
      }

      // Apply featured image
      if (changes.featuredImage) {
        const featuredImgs = document.querySelectorAll('.featured-image img, .hero-image img');
        featuredImgs.forEach(img => {
          img.src = changes.featuredImage;
          console.log('✅ Updated featured image');
        });
      }

      // Apply CTA changes
      if (changes.ctaText || changes.ctaColor || changes.ctaPosition) {
        const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, .buy-button');
        ctaButtons.forEach(btn => {
          if (changes.ctaText) {
            btn.textContent = changes.ctaText;
            console.log('✅ Updated CTA text');
          }
          if (changes.ctaColor) {
            btn.style.backgroundColor = changes.ctaColor;
            btn.style.borderColor = changes.ctaColor;
            console.log('✅ Updated CTA color');
          }
        });
      }

      // Apply layout changes
      if (changes.layout) {
        const mainContent = document.querySelector('.article-content, main, .content');
        if (mainContent) {
          // Remove existing layout classes
          mainContent.classList.remove('layout-grid', 'layout-list', 'layout-masonry', 'layout-full-width');
          // Add new layout class
          mainContent.classList.add('layout-' + changes.layout);
          console.log('✅ Updated layout to:', changes.layout);
        }
      }

      // Apply custom CSS
      if (changes.customCSS) {
        const style = document.createElement('style');
        style.textContent = changes.customCSS;
        document.head.appendChild(style);
        console.log('✅ Applied custom CSS');
      }

      // Apply custom HTML
      if (changes.customHTML) {
        const container = document.querySelector('.article-content, main, .content');
        if (container) {
          const customDiv = document.createElement('div');
          customDiv.className = 'ab-test-custom-content';
          customDiv.innerHTML = changes.customHTML;
          container.appendChild(customDiv);
          console.log('✅ Added custom HTML');
        }
      }

      // Apply full content changes (for full page tests)
      if (changes.content) {
        console.log('🔄 Applying full content changes...');
        // This would require more complex logic based on your content structure
        // For now, we'll just log it
        console.log('Full content changes:', changes.content);
      }
    }

    // Track conversion (exposed globally)
    window.abTestTrackConversion = function(conversionType, eventData) {
      if (!currentTest || !currentVariant) {
        console.log('⚠️ No active test, skipping conversion tracking');
        return;
      }
      
      const sessionId = getSessionId();
      
      const trackingParams = getTrackingParameters();
      
      mixpanel.track('Conversion', {
        test_id: currentTest.id,
        test_name: currentTest.name,
        variant_id: currentVariant.id,
        variant_name: currentVariant.name,
        conversion_type: conversionType || 'default',
        article_id: articleId,
        article_slug: articleSlug,
        session_id: sessionId,
        device_type: getDeviceType(),
        is_control: currentVariant.isControl,
        timestamp: new Date().toISOString(),
        ...trackingParams,
        ...eventData
      });

      console.log('🎯 Conversion tracked:', conversionType, eventData);
    };

    // Track click (exposed globally)
    window.abTestTrackClick = function(clickTarget, eventData) {
      if (!currentTest || !currentVariant) {
        console.log('⚠️ No active test, skipping click tracking');
        return;
      }
      
      const sessionId = getSessionId();
      
      const trackingParams = getTrackingParameters();
      
      mixpanel.track('Article Click', {
        test_id: currentTest.id,
        test_name: currentTest.name,
        variant_id: currentVariant.id,
        variant_name: currentVariant.name,
        click_target: clickTarget,
        article_id: articleId,
        article_slug: articleSlug,
        session_id: sessionId,
        device_type: getDeviceType(),
        is_control: currentVariant.isControl,
        timestamp: new Date().toISOString(),
        ...trackingParams,
        ...eventData
      });

      console.log('👆 Click tracked:', clickTarget, eventData);
    };

    // Load A/B test data from static JSON file on CDN
    async function loadABTestData() {
      try {
        // Fetch from CDN (Digital Ocean Spaces)
        const cdnDomain = '${process.env.ARTICLE_DOMAIN || 'daily.get.martideals.com'}';
        const cacheBuster = Math.floor(Date.now() / 60000); // Cache for 1 minute
        const jsonUrl = 'https://' + cdnDomain + '/' + articleSlug + '/ab-tests.json?v=' + cacheBuster;
        
        console.log('📂 Loading A/B test data from CDN:', jsonUrl);
        
        const response = await fetch(jsonUrl);
        
        if (!response.ok) {
          console.log('📝 No A/B test file found on CDN (this is normal if no tests are active)');
          return null;
        }
        
        const testData = await response.json();
        console.log('📊 Loaded A/B test data from CDN:', testData);
        return testData;
      } catch (error) {
        console.log('📝 No A/B tests found or error loading from CDN:', error.message);
        return null;
      }
    }

    // Initialize A/B test
    async function initializeABTest() {
      try {
        console.log('🚀 Initializing A/B testing (100% serverless)...');
        
        const sessionId = getSessionId();
        console.log('👤 Session ID:', sessionId);
        
        const testData = await loadABTestData();
        
        if (!testData || !testData.tests || testData.tests.length === 0) {
          console.log('📝 No active A/B tests for this article');
          return;
        }
        
        // Use first active test
        const activeTest = testData.tests[0];
        currentTest = activeTest;
        
        console.log('🧪 Active test found:', activeTest.name);
        console.log('🔍 Test variants:', activeTest.variants.length);
        
        // Filter active variants
        const activeVariants = activeTest.variants.filter(v => v.trafficPercent > 0);
        console.log('✅ Active variants:', activeVariants.length);
        
        // Assign variant using random assignment for better distribution
        const hash = hashString(sessionId + activeTest.id);
        const randomValue = Math.random() * 100; // Use Math.random for true randomness
        console.log('🎲 Random value generated:', randomValue.toFixed(2));
        
        let cumulative = 0;
        let assignedVariant = null;
        
        for (const variant of activeVariants) {
          cumulative += variant.trafficPercent;
          if (randomValue < cumulative) {
            assignedVariant = variant;
            break;
          }
        }
        
        // Fallback to control if no variant assigned
        if (!assignedVariant) {
          assignedVariant = activeVariants.find(v => v.isControl) || activeVariants[0];
        }
        
        currentVariant = assignedVariant;
        
        console.log('🎯 Randomly assigned variant:', assignedVariant.name, 'Random:', randomValue.toFixed(2));
        console.log('🎯 Final assigned variant:', assignedVariant.name, assignedVariant.isControl ? '(Control)' : '(Test Variant)');
        console.log('📦 Variant has template:', !!assignedVariant.template);
        console.log('📦 Variant has data:', !!assignedVariant.data);
        
        // Apply variant content - FIXED: Apply templates for ANY variant that has template data
        // Template-based variants (applies to both control and test variants)
        if (assignedVariant.template && assignedVariant.data) {
          applyVariantTemplate(assignedVariant);
        }
        // Simple change-based variants (backward compatibility - only for non-control variants)
        else if (assignedVariant.changes && !assignedVariant.isControl) {
          applyVariantChanges(assignedVariant.changes);
        }
        // Control variant without template or changes
        else if (assignedVariant.isControl && !assignedVariant.template && (!assignedVariant.changes || Object.keys(assignedVariant.changes).length === 0)) {
          console.log('📝 Control variant without template - keeping original content');
        }
        
        // Get all tracking parameters
        const trackingParams = getTrackingParameters();
        
        // Track view in Mixpanel with all parameters
        mixpanel.track('Variant Viewed', {
          test_id: activeTest.id,
          test_name: activeTest.name,
          test_type: activeTest.testType,
          variant_id: variant.id,
          variant_name: variant.name,
          article_id: articleId,
          article_slug: articleSlug,
          session_id: sessionId,
          is_control: variant.isControl,
          traffic_percent: variant.trafficPercent,
          device_type: getDeviceType(),
          timestamp: new Date().toISOString(),
          ...trackingParams
        });

        mixpanel.track('Article Viewed', {
          article_id: articleId,
          article_slug: articleSlug,
          test_id: activeTest.id,
          test_name: activeTest.name,
          variant_id: variant.id,
          variant_name: variant.name,
          session_id: sessionId,
          device_type: getDeviceType(),
          has_active_test: true,
          timestamp: new Date().toISOString(),
          ...trackingParams
        });

        console.log('📊 Events tracked to Mixpanel');
        console.log('✅ A/B testing initialization complete!');
        
      } catch (error) {
        console.error('❌ Error initializing A/B test:', error);
        
        // Track error
        mixpanel.track('AB Test Error', {
          article_id: articleId,
          article_slug: articleSlug,
          error_message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Auto-track CTA clicks
    function setupAutoTracking() {
      const ctaSelectors = [
        '.cta-button', '.btn-primary', '.buy-button', '.shop-button',
        'a[href*="buy"]', 'a[href*="shop"]', 'a[href*="purchase"]',
        '.add-to-cart', '.checkout-button'
      ];
      
      ctaSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(function(btn) {
          btn.addEventListener('click', function() {
            window.abTestTrackClick('cta_button', {
              button_text: btn.textContent?.trim(),
              button_href: btn.href,
              button_class: btn.className,
            });
          });
        });
      });

      // Track product clicks
      document.querySelectorAll('.product-card, .product-item, .product').forEach(function(product) {
        product.addEventListener('click', function() {
          window.abTestTrackClick('product_click', {
            product_title: product.querySelector('h3, h4, .product-title')?.textContent?.trim(),
          });
        });
      });

      console.log('🎯 Auto-tracking setup complete');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initializeABTest();
        setupAutoTracking();
      });
    } else {
      // DOM already loaded
      initializeABTest();
      setupAutoTracking();
    }

    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
      if (currentTest && currentVariant) {
        const timeOnPage = (Date.now() - startTime) / 1000;
        
        mixpanel.track('Article Exit', {
          test_id: currentTest.id,
          variant_id: currentVariant.id,
          article_id: articleId,
          article_slug: articleSlug,
          session_id: getSessionId(),
          time_on_page: timeOnPage,
          device_type: getDeviceType(),
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log('🚀 Pure Static A/B Testing loaded for:', articleSlug);
  })();
</script>
`;
}
