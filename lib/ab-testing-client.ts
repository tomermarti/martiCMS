// Client-side A/B testing script to be injected into published articles
// This script runs on the published article pages (not in the CMS)

export function getABTestingScript(articleId: string, articleSlug: string): string {
  return `
<!-- Mixpanel A/B Testing Integration -->
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

  // A/B Testing utilities
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
    }

    // Track variant view
    async function trackView(testId, variantId, sessionId) {
      try {
        await fetch('/api/ab-tests/' + testId + '/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'view',
            variantId: variantId,
            sessionId: sessionId,
          }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }

    // Track conversion
    window.abTestTrackConversion = async function(conversionType, eventData) {
      if (!currentTestId || !currentVariantId) return;
      
      const sessionId = getSessionId();
      
      try {
        await fetch('/api/ab-tests/' + currentTestId + '/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'conversion',
            variantId: currentVariantId,
            sessionId: sessionId,
            eventData: { conversionType: conversionType || 'default', ...eventData },
          }),
        });

        const trackingParams = getTrackingParameters();
        
        mixpanel.track('Conversion', {
          test_id: currentTestId,
          variant_id: currentVariantId,
          conversion_type: conversionType || 'default',
          article_id: articleId,
          article_slug: articleSlug,
          session_id: sessionId,
          device_type: getDeviceType(),
          timestamp: new Date().toISOString(),
          ...trackingParams
        });
      } catch (error) {
        console.error('Error tracking conversion:', error);
      }
    };

    // Track click
    window.abTestTrackClick = async function(clickTarget, eventData) {
      if (!currentTestId || !currentVariantId) return;
      
      const sessionId = getSessionId();
      
      try {
        await fetch('/api/ab-tests/' + currentTestId + '/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'click',
            variantId: currentVariantId,
            sessionId: sessionId,
            eventData: { clickTarget: clickTarget, ...eventData },
          }),
        });

        const trackingParams = getTrackingParameters();
        
        mixpanel.track('Article Click', {
          test_id: currentTestId,
          variant_id: currentVariantId,
          click_target: clickTarget,
          article_id: articleId,
          article_slug: articleSlug,
          session_id: sessionId,
          device_type: getDeviceType(),
          timestamp: new Date().toISOString(),
          ...trackingParams
        });
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };

    // Initialize A/B test on page load
    async function initializeABTest() {
      try {
        const sessionId = getSessionId();
        
        // Fetch active A/B test for this article
        const response = await fetch('/api/ab-tests?articleId=' + articleId);
        if (!response.ok) return;
        
        const tests = await response.json();
        const activeTest = tests.find(t => t.status === 'running');
        
        if (!activeTest || !activeTest.variants || activeTest.variants.length === 0) {
          return;
        }
        
        currentTestId = activeTest.id;
        
        // Assign variant
        const variant = assignVariant(activeTest.variants, sessionId, activeTest.id);
        currentVariantId = variant.id;
        currentVariantChanges = variant.changes;
        
        // Apply changes
        applyVariantChanges(variant.changes);
        
        // Track view
        await trackView(activeTest.id, variant.id, sessionId);
        
        // Get all tracking parameters
        const trackingParams = getTrackingParameters();
        
        // Track in Mixpanel with all parameters
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
      } catch (error) {
        console.error('Error initializing A/B test:', error);
      }
    }

    // Auto-track CTA clicks
    document.addEventListener('DOMContentLoaded', function() {
      initializeABTest();
      
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
    });

    // Track time on page for engagement metrics
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
      const timeOnPage = (Date.now() - startTime) / 1000; // seconds
      if (currentTestId && currentVariantId) {
        navigator.sendBeacon('/api/ab-tests/' + currentTestId + '/track', JSON.stringify({
          eventType: 'exit',
          variantId: currentVariantId,
          sessionId: getSessionId(),
          eventData: { timeOnPage: timeOnPage },
        }));
      }
    });
  })();
</script>
`;
}

