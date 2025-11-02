'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    }
    setPreferences(onlyNecessary)
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'necessary') return // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <div className="cookie-info">
            <h3>🍪 We Value Your Privacy</h3>
            <p>
              We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
              <strong> By clicking any links or continuing, you agree to the sharing of technical information with third parties for analytics, service improvements, and related business purposes.</strong>
              <br /><br />
              You can choose which cookies to accept. For California residents, this also relates to your 
              <Link href="https://daily.get.martideals.com/assets/ccpa-privacy-rights.html" className="privacy-link"> CCPA privacy rights</Link>.
            </p>
          </div>
          
          <div className="cookie-actions">
            <button 
              onClick={() => setShowPreferences(true)}
              className="btn btn-outlined btn-small"
            >
              Customize
            </button>
            <button 
              onClick={handleRejectAll}
              className="btn btn-outlined btn-small"
            >
              Reject All
            </button>
            <button 
              onClick={handleAcceptAll}
              className="btn btn-primary btn-small"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="cookie-modal-overlay">
          <div className="cookie-modal">
            <div className="cookie-modal-header">
              <h2>Cookie Preferences</h2>
              <button 
                onClick={() => setShowPreferences(false)}
                className="close-button"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="cookie-modal-content">
              <p>
                Choose which cookies you want to accept. You can change these settings at any time.
              </p>
              
              <div className="cookie-categories">
                <div className="cookie-category">
                  <div className="category-header">
                    <h4>Necessary Cookies</h4>
                    <div className="toggle-switch disabled">
                      <input 
                        type="checkbox" 
                        checked={preferences.necessary}
                        disabled
                        readOnly
                      />
                      <span className="slider"></span>
                    </div>
                  </div>
                  <p>Required for the website to function properly. Cannot be disabled.</p>
                </div>

                <div className="cookie-category">
                  <div className="category-header">
                    <h4>Analytics Cookies</h4>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                      />
                      <span className="slider"></span>
                    </div>
                  </div>
                  <p>Help us understand how visitors interact with our website.</p>
                </div>

                <div className="cookie-category">
                  <div className="category-header">
                    <h4>Marketing Cookies</h4>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                      />
                      <span className="slider"></span>
                    </div>
                  </div>
                  <p>Used to deliver personalized advertisements and track campaign performance.</p>
                </div>

                <div className="cookie-category">
                  <div className="category-header">
                    <h4>Personalization Cookies</h4>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={preferences.personalization}
                        onChange={() => handlePreferenceChange('personalization')}
                      />
                      <span className="slider"></span>
                    </div>
                  </div>
                  <p>Remember your preferences and provide a customized experience.</p>
                </div>
              </div>
            </div>
            
            <div className="cookie-modal-footer">
              <button 
                onClick={handleRejectAll}
                className="btn btn-outlined"
              >
                Reject All
              </button>
              <button 
                onClick={handleSavePreferences}
                className="btn btn-primary"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-systemBackground);
          border-top: 1px solid var(--color-separator);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          z-index: 10000;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .cookie-banner-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--spacing-4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-4);
        }

        .cookie-info h3 {
          margin: 0 0 var(--spacing-2) 0;
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-label);
        }

        .cookie-info p {
          margin: 0;
          color: var(--color-secondaryLabel);
          line-height: 1.4;
        }

        .privacy-link {
          color: var(--color-primary);
          text-decoration: underline;
        }

        .cookie-actions {
          display: flex;
          gap: var(--spacing-3);
          flex-shrink: 0;
        }

        .cookie-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          padding: var(--spacing-4);
        }

        .cookie-modal {
          background: var(--color-systemBackground);
          border-radius: var(--border-radius-lg);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .cookie-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-6) var(--spacing-6) var(--spacing-4) var(--spacing-6);
          border-bottom: 1px solid var(--color-separator);
        }

        .cookie-modal-header h2 {
          margin: 0;
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--color-label);
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--color-secondaryLabel);
          padding: var(--spacing-2);
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: var(--color-systemFill);
          color: var(--color-label);
        }

        .cookie-modal-content {
          padding: var(--spacing-6);
        }

        .cookie-modal-content > p {
          margin: 0 0 var(--spacing-6) 0;
          color: var(--color-secondaryLabel);
          line-height: 1.5;
        }

        .cookie-categories {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-5);
        }

        .cookie-category {
          border: 1px solid var(--color-separator);
          border-radius: var(--border-radius);
          padding: var(--spacing-4);
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-2);
        }

        .category-header h4 {
          margin: 0;
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-label);
        }

        .cookie-category p {
          margin: 0;
          color: var(--color-secondaryLabel);
          font-size: var(--font-size-sm);
          line-height: 1.4;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--color-systemFill);
          transition: 0.3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input:checked + .slider {
          background-color: var(--color-primary);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .toggle-switch.disabled .slider {
          background-color: var(--color-systemGreen);
          cursor: not-allowed;
        }

        .toggle-switch.disabled .slider:before {
          transform: translateX(26px);
        }

        .cookie-modal-footer {
          display: flex;
          gap: var(--spacing-3);
          justify-content: flex-end;
          padding: var(--spacing-4) var(--spacing-6) var(--spacing-6) var(--spacing-6);
          border-top: 1px solid var(--color-separator);
        }

        @media (max-width: 768px) {
          .cookie-banner-content {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: var(--spacing-4);
          }

          .cookie-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .cookie-modal {
            margin: var(--spacing-4);
            max-height: calc(100vh - 2 * var(--spacing-4));
          }

          .cookie-modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}
