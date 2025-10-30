'use client'

export default function CookiePolicy() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--spacing-4)' }}>
      <div className="cookie-policy-page">
        <header className="page-header">
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last Updated: October 27, 2025</p>
        </header>

        <div className="content">
          <section>
            <h2>🍪 What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to website owners.
            </p>
          </section>

          <section>
            <h2>🎯 How We Use Cookies</h2>
            <p>
              MartiDeals uses cookies to enhance your experience on our website, analyze site traffic, 
              and for marketing purposes. We use different types of cookies for different purposes:
            </p>

            <div className="cookie-types">
              <div className="cookie-type">
                <h3>🔧 Necessary Cookies</h3>
                <p>
                  These cookies are essential for the website to function properly. They enable basic 
                  functions like page navigation and access to secure areas of the website. The website 
                  cannot function properly without these cookies.
                </p>
                <p><strong>Examples:</strong> Session management, security, load balancing</p>
                <p><strong>Duration:</strong> Session or up to 1 year</p>
              </div>

              <div className="cookie-type">
                <h3>📊 Analytics Cookies</h3>
                <p>
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our website performance 
                  and user experience.
                </p>
                <p><strong>Examples:</strong> Google Analytics, page views, bounce rate</p>
                <p><strong>Duration:</strong> Up to 2 years</p>
              </div>

              <div className="cookie-type">
                <h3>📢 Marketing Cookies</h3>
                <p>
                  These cookies are used to deliver personalized advertisements and track the effectiveness 
                  of our advertising campaigns. They may be set by us or by third-party advertising partners.
                </p>
                <p><strong>Examples:</strong> Facebook Pixel, Google Ads, retargeting</p>
                <p><strong>Duration:</strong> Up to 1 year</p>
              </div>

              <div className="cookie-type">
                <h3>⚙️ Personalization Cookies</h3>
                <p>
                  These cookies remember your preferences and provide a customized experience. They help 
                  us remember your settings and provide content that's relevant to you.
                </p>
                <p><strong>Examples:</strong> Language preferences, theme settings, user preferences</p>
                <p><strong>Duration:</strong> Up to 1 year</p>
              </div>
            </div>
          </section>

          <section>
            <h2>🔍 Third-Party Cookies</h2>
            <p>
              We may use third-party services that set their own cookies. These services include:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Google Ads:</strong> For advertising and remarketing</li>
              <li><strong>Facebook Pixel:</strong> For social media advertising and analytics</li>
              <li><strong>YouTube:</strong> For embedded video content</li>
            </ul>
            <p>
              These third parties have their own privacy policies and cookie practices. We recommend 
              reviewing their policies to understand how they use cookies.
            </p>
          </section>

          <section>
            <h2>⚙️ Managing Your Cookie Preferences</h2>
            <p>
              You have several options for managing cookies:
            </p>

            <h3>🎛️ Our Cookie Consent Tool</h3>
            <p>
              When you first visit our website, you'll see a cookie consent banner that allows you to 
              choose which types of cookies to accept. You can change your preferences at any time by 
              clicking the "Cookie Settings" link in our footer.
            </p>

            <h3>🌐 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul>
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Set cookies to expire when you close your browser</li>
            </ul>

            <div className="browser-links">
              <h4>Browser-specific instructions:</h4>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>
            </div>
          </section>

          <section>
            <h2>📱 Mobile Devices</h2>
            <p>
              On mobile devices, you can manage cookies and tracking through your device settings:
            </p>
            <ul>
              <li><strong>iOS:</strong> Settings → Privacy & Security → Tracking</li>
              <li><strong>Android:</strong> Settings → Privacy → Ads</li>
            </ul>
          </section>

          <section>
            <h2>⚠️ Impact of Disabling Cookies</h2>
            <p>
              Please note that disabling certain cookies may impact your experience on our website:
            </p>
            <ul>
              <li>Some features may not work properly</li>
              <li>You may need to re-enter information more frequently</li>
              <li>Personalized content and recommendations may not be available</li>
              <li>We may not be able to remember your preferences</li>
            </ul>
          </section>

          <section>
            <h2>🔄 Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes by updating the "Last Updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2>📞 Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:privacy@martideals.com">privacy@martideals.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:1-800-MARTI-01">1-800-MARTI-01</a></p>
              <p><strong>Address:</strong><br />
                MartiDeals Privacy Team<br />
                123 Privacy Lane<br />
                San Francisco, CA 94102
              </p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .cookie-policy-page {
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
          margin: var(--spacing-4) 0 var(--spacing-2) 0;
        }

        section h4 {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-label);
          margin: var(--spacing-3) 0 var(--spacing-2) 0;
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

        .cookie-types {
          display: grid;
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .cookie-type {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .cookie-type h3 {
          margin-top: 0;
          margin-bottom: var(--spacing-3);
        }

        .cookie-type p {
          margin-bottom: var(--spacing-2);
        }

        .cookie-type p:last-child {
          margin-bottom: 0;
        }

        .browser-links {
          background: var(--color-tertiarySystemBackground);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
          margin-top: var(--spacing-4);
        }

        .browser-links h4 {
          margin-top: 0;
        }

        .contact-info {
          background: var(--color-secondarySystemBackground);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .contact-info p {
          margin: 0 0 var(--spacing-2) 0;
        }

        .contact-info p:last-child {
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
        }
      `}</style>
    </div>
  )
}
