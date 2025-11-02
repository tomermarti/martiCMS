'use client'

import { useState, useEffect } from 'react'

export default function DoNotSell() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [alreadyOptedOut, setAlreadyOptedOut] = useState(false)

  useEffect(() => {
    // Check if user has already opted out
    const optOut = localStorage.getItem('ccpa-opt-out')
    if (optOut === 'true') {
      setAlreadyOptedOut(true)
      setIsSubmitted(true)
    }
  }, [])

  const handleSubmit = () => {
    // Set opt-out preference in localStorage
    localStorage.setItem('ccpa-opt-out', 'true')
    localStorage.setItem('ccpa-opt-out-date', new Date().toISOString())
    
    // Update cookie consent to reject marketing cookies
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    
    // Delete existing third-party cookies
    deleteThirdPartyCookies()
    
    // Show confirmation
    setIsSubmitted(true)
    
    // Optional: Send request to server for logging
    try {
      fetch('/api/ccpa-opt-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          optOut: true
        })
      }).catch(() => {
        // Silent failure - the client-side opt-out is what matters
      })
    } catch (error) {
      // Silent failure - the client-side opt-out is what matters
    }
  }

  const deleteThirdPartyCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(';')
    
    // Common third-party cookie prefixes/names to delete
    const thirdPartyPrefixes = [
      '_ga', '_gid', '_gat', '_gtag', '_gcl', // Google Analytics/Ads
      '_fbp', '_fbc', 'fr', // Facebook
      '__utma', '__utmb', '__utmc', '__utmt', '__utmz', // Google Analytics (legacy)
      '_hjid', '_hjIncludedInSessionSample', // Hotjar
      'IDE', 'DSID', 'FLC', 'AID', 'TAID', // DoubleClick
      '__cfduid', // Cloudflare
      '_tt_enable_cookie', 'tt_appInfo', 'tt_sessionId', // TikTok
      'personalization_id', 'guest_id', // Twitter
      'bcookie', 'lidc', 'UserMatchHistory', // LinkedIn
      'uuid2', 'anj', 'sess', // AppNexus
      'tuuid', 'tuuid_lu', // The Trade Desk
      'CMID', 'CMPS', 'rum', // Casale Media
      'rpb', 'rpx', // RunAds
      'mc', 'ms', // Quantcast
      'UID', 'UIDR', // Scorecardresearch
      'ANID', 'CONSENT', 'NID', '1P_JAR', 'APISID', 'HSID', 'SAPISID', 'SID', 'SIDCC', 'SSID', // Google
      'mp_', 'mixpanel', '__mp_opt_in_out' // Mixpanel
    ]
    
    cookies.forEach(function(cookie) {
      const cookieName = cookie.split('=')[0].trim()
      
      // Check if it's a third-party cookie
      const isThirdParty = thirdPartyPrefixes.some(prefix => 
        cookieName.startsWith(prefix) || cookieName.includes(prefix)
      )
      
      if (isThirdParty) {
        // Delete cookie for current domain
        document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';'
        document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';'
        
        // Try to delete for parent domains
        const domainParts = window.location.hostname.split('.')
        for (let i = 0; i < domainParts.length - 1; i++) {
          const parentDomain = '.' + domainParts.slice(i).join('.')
          document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + parentDomain + ';'
        }
      }
    })
    
    // Clear localStorage items related to tracking
    const trackingKeys = [
      '_ga', '_gid', '_gat', '_gtag',
      '_fbp', '_fbc',
      '__utma', '__utmb', '__utmc', '__utmt', '__utmz',
      '_hjid', '_hjIncludedInSessionSample',
      'mp_', 'mixpanel', '__mp_opt_in_out', 'mp_super_properties'
    ]
    
    trackingKeys.forEach(key => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
  }

  return (
    <div className="main-content">
      <div className="page-container">
        <div className="do-not-sell-page">
        <header className="page-header">
          <h1>Do Not Sell or Share My Personal Information</h1>
        </header>

        <div className="content">
          {!isSubmitted ? (
            <>
              <div className="intro-text">
                <p>
                  You may opt out of the "sale" of your personal information at any time. Once you submit 
                  your request, we will stop sharing your information and device identifiers with third 
                  parties. This opt-out works only for the device and browser you're using right now. If you 
                  use another computer, phone, or browser, you'll need to opt out again there too.
                </p>
              </div>

              <div className="form-section">
                <button 
                  onClick={handleSubmit}
                  className="submit-button"
                >
                  Submit Request
                </button>
              </div>
            </>
          ) : (
            <div className="confirmation-section">
              <div className="confirmation-message">
                <h2>✅ {alreadyOptedOut ? 'Already Opted Out' : 'Request Received'}</h2>
                <p>
                  {alreadyOptedOut 
                    ? 'You have already opted out of the sale of your personal information. Your preferences are still active and we continue to respect your choice.'
                    : 'Your request has been received and processed immediately. We have deleted third-party tracking cookies and will stop sharing your information with third parties for advertising purposes.'
                  }
                </p>
                <div className="additional-info">
                  <h3>What happens next:</h3>
                  <ul>
                    <li>✅ Third-party tracking cookies have been deleted</li>
                    <li>✅ Marketing cookies have been disabled</li>
                    <li>✅ Your device identifier will not be shared with advertisers</li>
                    <li>⚠️ This opt-out is device and browser specific</li>
                    <li>📱 You'll need to opt-out separately on other devices/browsers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      <style jsx>{`
        .do-not-sell-page {
          line-height: 1.6;
          padding: var(--spacing-8) 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
          padding-bottom: var(--spacing-6);
          border-bottom: 1px solid var(--color-separator);
        }

        .page-header h1 {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-label);
          margin: 0;
          font-family: var(--font-family-display);
          line-height: 1.3;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }

        .intro-text {
          background: var(--color-secondarySystemBackground);
          padding: var(--spacing-6);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .intro-text p {
          color: var(--color-secondaryLabel);
          margin: 0;
          font-size: var(--font-size-lg);
          line-height: 1.6;
        }

        .form-section {
          text-align: center;
          padding: var(--spacing-6);
        }

        .submit-button {
          background: var(--color-primary);
          color: white;
          border: none;
          padding: var(--spacing-4) var(--spacing-8);
          border-radius: var(--border-radius);
          font-size: var(--font-size-lg);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 200px;
        }

        .submit-button:hover {
          background: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(60, 60, 67, 0.3);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .confirmation-section {
          text-align: center;
          padding: var(--spacing-8);
          background: var(--color-systemGreen);
          background: linear-gradient(135deg, #34C759, #30D158);
          color: white;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 8px 24px rgba(52, 199, 89, 0.3);
        }

        .confirmation-message h2 {
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin: 0 0 var(--spacing-4) 0;
          color: white;
        }

        .confirmation-message p {
          font-size: var(--font-size-lg);
          margin: 0 0 var(--spacing-4) 0;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
        }

        .additional-info {
          background: rgba(255, 255, 255, 0.1);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          margin-top: var(--spacing-4);
          text-align: left;
        }

        .additional-info h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin: 0 0 var(--spacing-3) 0;
          color: white;
        }

        .additional-info ul {
          margin: 0;
          padding-left: var(--spacing-4);
          color: rgba(255, 255, 255, 0.9);
        }

        .additional-info li {
          margin-bottom: var(--spacing-2);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: var(--font-size-xl);
          }

          .intro-text {
            padding: var(--spacing-4);
          }

          .intro-text p {
            font-size: var(--font-size-base);
          }

          .submit-button {
            padding: var(--spacing-3) var(--spacing-6);
            font-size: var(--font-size-base);
            min-width: 160px;
          }

          .confirmation-section {
            padding: var(--spacing-6);
          }

          .confirmation-message h2 {
            font-size: var(--font-size-lg);
          }

          .confirmation-message p {
            font-size: var(--font-size-base);
          }
        }
      `}</style>
    </div>
  )
}
