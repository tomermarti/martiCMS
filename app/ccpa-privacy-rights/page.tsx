'use client'

import { useEffect } from 'react'

export default function CCPAPrivacyRights() {
  useEffect(() => {
    // Add the handleOptOut function to window object
    (window as any).handleOptOut = function() {
      // Set opt-out preference
      localStorage.setItem('ccpa-opt-out', 'true');
      localStorage.setItem('ccpa-opt-out-date', new Date().toISOString());
      
      // Update cookie consent to reject marketing cookies
      const consent = {
        necessary: true,
        analytics: false,
        marketing: false,
        personalization: false
      };
      localStorage.setItem('cookie-consent', JSON.stringify(consent));
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
      
      // Show confirmation
      alert('Your opt-out preference has been saved. Marketing cookies have been disabled.');
      
      // Optionally reload the page to apply changes
      window.location.reload();
    };

    (window as any).handleOptIn = function() {
      // Remove opt-out preference
      localStorage.removeItem('ccpa-opt-out');
      localStorage.removeItem('ccpa-opt-out-date');
      
      // Show confirmation
      alert('Your opt-in preference has been saved. You can manage cookie preferences through our cookie banner.');
    };
  }, []);
  return (
    <div className="main-content">
      <div className="page-container">
        <div className="privacy-page">
        <header className="page-header">
          <h1>California Consumer Privacy Act (CCPA) Rights</h1>
          <p className="last-updated">Last Updated: October 27, 2025</p>
        </header>

        <div className="content">
          <div className="intro-section">
            <p>
              <strong>2.5 million+ people assisted in the last 30 days</strong>
            </p>
            <p>
              If you are a California resident, you have specific rights regarding your personal information 
              under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). 
              This page explains your rights and how to exercise them.
            </p>
            <p>
              MartiDeals is committed to protecting your privacy and ensuring you have control over your 
              personal information. We comply with all applicable California privacy laws and provide you 
              with the tools and information you need to exercise your rights.
            </p>
          </div>

          <section>
            <h2>🔒 Your Privacy Rights Under CCPA/CPRA</h2>
            <p>
              <strong>Summary:</strong> California residents have specific rights under the CCPA/CPRA, including 
              the right to know what personal information we collect, the right to delete personal information, 
              the right to opt-out of the sale or sharing of personal information, and the right to non-discrimination.
            </p>
          </section>

          <section>
            <h2>📋 Your Rights Include:</h2>
            <div className="rights-list">
              <div className="right-item">
                <h3>🔍 Right to Know</h3>
                <p>You have the right to know what personal information we collect, use, disclose, and sell about you.</p>
              </div>
              
              <div className="right-item">
                <h3>🗑️ Right to Delete</h3>
                <p>You have the right to request that we delete your personal information, subject to certain exceptions.</p>
              </div>
              
              <div className="right-item">
                <h3>🚫 Right to Opt-Out</h3>
                <p>You have the right to opt-out of the sale of your personal information.</p>
              </div>
              
              <div className="right-item">
                <h3>⚖️ Right to Non-Discrimination</h3>
                <p>We will not discriminate against you for exercising your CCPA rights.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>📊 Categories of Personal Information We Collect</h2>
            <ul>
              <li><strong>Identifiers:</strong> Name, email address, IP address</li>
              <li><strong>Internet Activity:</strong> Browsing history, search history, interaction with our website</li>
              <li><strong>Commercial Information:</strong> Purchase history, preferences</li>
              <li><strong>Geolocation Data:</strong> General location based on IP address</li>
            </ul>
          </section>

          <section>
            <h2>🎯 How We Use Your Information</h2>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process transactions</li>
              <li>Send marketing communications (with consent)</li>
              <li>Analyze website usage and performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>🤝 Information Sharing</h2>
            <p>
              We may share your personal information with:
            </p>
            <ul>
              <li>Service providers who help us operate our business</li>
              <li>Analytics providers (like Google Analytics)</li>
              <li>Marketing partners (only with your consent)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2>💰 Selling or Sharing of Personal Information under the CPRA</h2>
            <p>
              For purposes of the CPRA, we do not "sell" personal information in the traditional sense 
              (i.e., for monetary compensation). However, we may "share" personal information for 
              cross-context behavioral advertising, which is considered a "sale" under CPRA.
            </p>
            <p>
              We may share the following categories of personal information for advertising purposes:
            </p>
            <ul>
              <li>Identifiers (such as IP address, device ID)</li>
              <li>Internet or electronic network activity information</li>
              <li>Commercial information (browsing and purchase history)</li>
              <li>Inferences drawn from the above information</li>
            </ul>
            <p>
              We share this information with:
            </p>
            <ul>
              <li>Advertising networks and platforms</li>
              <li>Social media companies</li>
              <li>Analytics providers</li>
              <li>Marketing technology partners</li>
            </ul>
          </section>

          <section className="do-not-sell-section">
            <h2>🛑 Do Not Sell or Share My Personal Information</h2>
            <p>
              You have the right to opt-out of the sale or sharing of your personal information. 
              This includes opting out of targeted advertising based on your personal information.
            </p>
            
            <div className="opt-out-form">
              <button className="btn btn-primary btn-large opt-out-btn" onClick={() => (window as any).handleOptOut()}>
                🔒 Do Not Sell or Share My Personal Information
              </button>
              <p className="form-note">
                This will opt you out of the sale or sharing of your personal information for 
                advertising purposes. You may still see ads, but they won't be targeted based 
                on your personal information.
              </p>
            </div>

            <div className="opt-out-methods">
              <h4>Additional Opt-Out Methods:</h4>
              <ul>
                <li><strong>Global Privacy Control (GPC):</strong> We honor GPC signals from your browser</li>
                <li><strong>Cookie Settings:</strong> Use our cookie preference center to manage tracking</li>
                <li><strong>Email Request:</strong> Send your request to <a href="mailto:privacy@martideals.com">privacy@martideals.com</a></li>
                <li><strong>Phone:</strong> Call us at <a href="tel:1-800-MARTI-01">1-800-MARTI-01</a></li>
              </ul>
            </div>

          </section>

          <section>
            <h2>📝 How to Exercise Your Rights</h2>
            <p>To exercise your CCPA rights, you can:</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <h4>📧 Email Us</h4>
                <p>Send your request to: <a href="mailto:privacy@martideals.com">privacy@martideals.com</a></p>
              </div>
              
              <div className="contact-method">
                <h4>📞 Call Us</h4>
                <p>Call our privacy hotline: <a href="tel:1-800-MARTI-01">1-800-MARTI-01</a></p>
              </div>
              
              <div className="contact-method">
                <h4>📮 Mail Us</h4>
                <p>
                  MartiDeals Privacy Team<br />
                  123 Privacy Lane<br />
                  San Francisco, CA 94102
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>⏱️ Response Timeline</h2>
            <p>
              We will respond to your request within 45 days. If we need additional time, 
              we will notify you and may extend the response period by an additional 45 days.
            </p>
          </section>

          <section>
            <h2>🆔 Identity Verification</h2>
            <p>
              To protect your privacy, we may need to verify your identity before processing your request. 
              We may ask for additional information to confirm you are the person about whom we have collected personal information.
            </p>
          </section>

          <section>
            <h2>📞 Questions?</h2>
            <p>
              If you have any questions about your CCPA rights or this notice, please contact us at{' '}
              <a href="mailto:privacy@martideals.com">privacy@martideals.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>

      <style jsx>{`
        .privacy-page {
          line-height: 1.6;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
          padding-bottom: var(--spacing-6);
          border-bottom: 1px solid var(--color-separator);
        }

        .page-header h1 {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-label);
          margin: 0 0 var(--spacing-3) 0;
          font-family: var(--font-family-display);
        }

        .last-updated {
          color: var(--color-secondaryLabel);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }

        section h2 {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-4) 0;
        }

        section h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-2) 0;
        }

        section h4 {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-2) 0;
        }

        section p {
          color: var(--color-secondaryLabel);
          margin: 0 0 var(--spacing-4) 0;
        }

        section ul {
          color: var(--color-secondaryLabel);
          padding-left: var(--spacing-6);
          margin: 0 0 var(--spacing-4) 0;
        }

        section li {
          margin-bottom: var(--spacing-2);
        }

        .rights-list {
          display: grid;
          gap: var(--spacing-4);
        }

        .right-item {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .right-item h3 {
          margin-bottom: var(--spacing-2);
        }

        .right-item p {
          margin: 0;
        }

        .do-not-sell-section {
          background: var(--color-primaryTranslucent);
          padding: var(--spacing-6);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-primaryBorder);
        }

        .opt-out-form {
          text-align: center;
          margin-top: var(--spacing-4);
        }

        .opt-out-btn {
          font-size: var(--font-size-lg);
          padding: var(--spacing-4) var(--spacing-6);
          margin-bottom: var(--spacing-3);
        }

        .form-note {
          font-size: var(--font-size-sm);
          color: var(--color-secondaryLabel);
          margin: 0;
        }

        .contact-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .contact-method {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .contact-method h4 {
          margin-bottom: var(--spacing-2);
        }

        .contact-method p {
          margin: 0;
        }

        a {
          color: var(--color-primary);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: var(--font-size-2xl);
          }

          .contact-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
