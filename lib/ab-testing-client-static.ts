// Static A/B testing client script - no server calls, reads local JSON
export function getStaticABTestingScript(articleId: string, articleSlug: string): string {
  return `
<!-- Static A/B Testing & Mixpanel Integration -->
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

  // Static A/B Testing - No Server Calls!
  (function() {
    const articleId = '${articleId}';
    const articleSlug = '${articleSlug}';
    let currentTestId = null;
    let currentVariantId = null;
    let currentVariantChanges = null;

    // Get or create session ID
    function getSessionId() {
      let sessionId = localStorage.getItem('ab_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ab_session_id', sessionId);
      }
      return sessionId;
    }

    // Get device type
    function getDeviceType() {
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
      // Check if already assigned
      const storageKey = 'ab_test_' + testId + '_variant';
      const storedVariantId = localStorage.getItem(storageKey);
      
      if (storedVariantId) {
        const variant = variants.find(v => v.id === storedVariantId);
        if (variant) return variant;
      }

      // Use consistent hashing
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
      
      // Fallback to control
      const control = variants.find(v => v.isControl) || variants[0];
      localStorage.setItem(storageKey, control.id);
      return control;
    }

    // Apply variant changes to the page
    function applyVariantChanges(changes) {
      if (!changes) return;

      // Apply title changes
      if (changes.title) {
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = changes.title;
        document.title = changes.title;
      }

      // Apply meta title
      if (changes.metaTitle) {
        document.title = changes.metaTitle;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', changes.metaTitle);
      }

      // Apply meta description
      if (changes.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', changes.metaDescription);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', changes.metaDescription);
      }

      // Apply featured image
      if (changes.featuredImage) {
        const featuredImg = document.querySelector('.featured-image img');
        if (featuredImg) featuredImg.src = changes.featuredImage;
      }

      // Apply CTA changes
      if (changes.ctaText || changes.ctaColor || changes.ctaPosition) {
        const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary');
        ctaButtons.forEach(btn => {
          if (changes.ctaText) btn.textContent = changes.ctaText;
          if (changes.ctaColor) btn.style.backgroundColor = changes.ctaColor;
        });
      }

      // Apply layout changes
      if (changes.layout) {
        const mainContent = document.querySelector('.article-content, main');
        if (mainContent) {
          mainContent.classList.add('layout-' + changes.layout);
        }
      }

      // Apply custom CSS
      if (changes.customCSS) {
        const style = document.createElement('style');
        style.textContent = changes.customCSS;
        document.head.appendChild(style);
      }

      // Apply custom HTML
      if (changes.customHTML) {
        const container = document.querySelector('.article-content, main');
        if (container) {
          const customDiv = document.createElement('div');
          customDiv.innerHTML = changes.customHTML;
          container.appendChild(customDiv);
        }
      }
    }

    // Track conversion (exposed globally)
    window.abTestTrackConversion = function(conversionType, eventData) {
      if (!currentTestId || !currentVariantId) return;
      
      const sessionId = getSessionId();
      
      // Get all tracking parameters
      const trackingParams = getTrackingParameters();
      
      // Track in Mixpanel with all parameters
      mixpanel.track('Conversion', {
        test_id: currentTestId,
        variant_id: currentVariantId,
        conversion_type: conversionType || 'default',
        article_id: articleId,
        article_slug: articleSlug,
        session_id: sessionId,
        device_type: getDeviceType(),
        timestamp: new Date().toISOString(),
        ...trackingParams,
        ...eventData
      });

      console.log('🎯 Conversion tracked:', conversionType, eventData);
    };

    // Track click (exposed globally)
    window.abTestTrackClick = function(clickTarget, eventData) {
      if (!currentTestId || !currentVariantId) return;
      
      const sessionId = getSessionId();
      
      // Get all tracking parameters
      const trackingParams = getTrackingParameters();
      
      // Track in Mixpanel with all parameters
      mixpanel.track('Article Click', {
        test_id: currentTestId,
        variant_id: currentVariantId,
        click_target: clickTarget,
        article_id: articleId,
        article_slug: articleSlug,
        session_id: sessionId,
        device_type: getDeviceType(),
        timestamp: new Date().toISOString(),
        ...trackingParams,
        ...eventData
      });

      console.log('👆 Click tracked:', clickTarget, eventData);
    };

    // Load A/B test data from static JSON file
    async function loadABTestData() {
      try {
        // Fetch local JSON file (no server call!)
        const response = await fetch('/' + articleSlug + '/ab-tests.json');
        
        if (!response.ok) {
          // No test file exists, no active tests
          console.log('📝 No A/B tests active for this article');
          return null;
        }
        
        const testData = await response.json();
        console.log('📊 Loaded A/B test data:', testData);
        return testData;
      } catch (error) {
        console.log('📝 No A/B tests found (file not found)');
        return null;
      }
    }

    // Initialize A/B test
    async function initializeABTest() {
      try {
        const sessionId = getSessionId();
        
        // Load test data from static JSON
        const testData = await loadABTestData();
        
        if (!testData || !testData.tests || testData.tests.length === 0) {
          console.log('📝 No active A/B tests for this article');
          return;
        }
        
        // Use first active test (you could modify this logic)
        const activeTest = testData.tests[0];
        currentTestId = activeTest.id;
        
        console.log('🧪 Active test found:', activeTest.name);
        
        // Assign variant
        const variant = assignVariant(activeTest.variants, sessionId, activeTest.id);
        currentVariantId = variant.id;
        currentVariantChanges = variant.changes;
        
        console.log('🎯 Assigned to variant:', variant.name, variant.isControl ? '(Control)' : '(Test)');
        
        // Apply changes
        applyVariantChanges(variant.changes);
        
        // Get all tracking parameters
        const trackingParams = getTrackingParameters();
        
        // Track view in Mixpanel with all parameters
        mixpanel.track('Variant Viewed', {
          test_id: activeTest.id,
          variant_id: variant.id,
          variant_name: variant.name,
          article_id: articleId,
          article_slug: articleSlug,
          session_id: sessionId,
          is_control: variant.isControl,
          traffic_percent: variant.trafficPercent,
          device_type: getDeviceType(),
          test_type: activeTest.testType,
          timestamp: new Date().toISOString(),
          ...trackingParams
        });

        mixpanel.track('Article Viewed', {
          article_id: articleId,
          article_slug: articleSlug,
          test_id: activeTest.id,
          variant_id: variant.id,
          variant_name: variant.name,
          session_id: sessionId,
          device_type: getDeviceType(),
          timestamp: new Date().toISOString(),
          ...trackingParams
        });

        console.log('📊 Events tracked to Mixpanel');
      } catch (error) {
        console.error('❌ Error initializing A/B test:', error);
      }
    }

    // Auto-track CTA clicks
    function setupAutoTracking() {
      // Track all CTA button clicks
      document.querySelectorAll('.cta-button, .btn-primary, a[href*="buy"], a[href*="shop"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          window.abTestTrackClick('cta_button', {
            button_text: btn.textContent,
            button_href: btn.href,
          });
        });
      });

      // Track product clicks
      document.querySelectorAll('.product-card, .product-item').forEach(function(product) {
        product.addEventListener('click', function() {
          window.abTestTrackClick('product_click', {
            product_title: product.querySelector('h3, h4')?.textContent,
          });
        });
      });

      console.log('🎯 Auto-tracking setup complete');
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      initializeABTest();
      setupAutoTracking();
    });

    // Track time on page for engagement metrics
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
      if (currentTestId && currentVariantId) {
        const timeOnPage = (Date.now() - startTime) / 1000; // seconds
        
        // Track exit event
        mixpanel.track('Article Exit', {
          test_id: currentTestId,
          variant_id: currentVariantId,
          article_id: articleId,
          article_slug: articleSlug,
          session_id: getSessionId(),
          time_on_page: timeOnPage,
          device_type: getDeviceType(),
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log('🚀 Static A/B Testing initialized for:', articleSlug);
  })();
</script>
`;
}

