'use client'

import { useState } from 'react'

export default function DoNotSell() {
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    
    // Show confirmation
    setIsSubmitted(true)
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--spacing-4)' }}>
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
                <h2>✅ Request Received</h2>
                <p>
                  Your request has been received. We will process your opt-out within 14 days 
                  and stop sharing your information.
                </p>
              </div>
            </div>
          )}
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
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
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
