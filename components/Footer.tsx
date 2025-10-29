'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <img 
                src="/martideals-logo.svg" 
                alt="MartiDeals Logo" 
                className="footer-logo"
              />
              <p>Your trusted source for the best deals and content management.</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>COMPANY</h4>
            <ul className="footer-links">
              <li><a href="https://www.martideals.com/about">About</a></li>
              <li><a href="https://www.martideals.com/privacy-policy">Privacy</a></li>
              <li><a href="https://www.martideals.com/terms-of-service">Terms</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>MORE</h4>
            <ul className="footer-links">
              <li><a href="https://www.martideals.com/">Categories</a></li>
              <li><a href="https://www.martideals.com/assets/do-not-sell.html">Do Not Sell My Personal Information</a></li>
              <li><a href="https://www.martideals.com/assets/ccpa-privacy-rights.html">CCPA Notice</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} MartiDeals. All rights reserved.</p>
            <div className="ccpa-notice">
              <a href="https://www.martideals.com/assets/do-not-sell.html" className="ccpa-link">
                🔒 Your Privacy Choices / Do Not Sell My Personal Information
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background: var(--color-systemGroupedBackground);
          border-top: 1px solid var(--color-separator);
          margin-top: auto;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-8);
          padding: var(--spacing-12) 0 var(--spacing-8) 0;
        }


        .footer-section h4 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-4) 0;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .footer-logo {
          height: 60px;
          width: auto;
          margin-bottom: var(--spacing-3);
        }

        .footer-brand p {
          color: var(--color-secondaryLabel);
          line-height: 1.5;
          margin: 0;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .footer-links a {
          color: var(--color-secondaryLabel);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--color-primary);
        }

        .footer-bottom {
          border-top: 1px solid var(--color-separator);
          padding: var(--spacing-6) 0;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-4);
        }

        .footer-bottom p {
          color: var(--color-secondaryLabel);
          margin: 0;
          font-size: var(--font-size-sm);
        }

        .ccpa-notice {
          display: flex;
          align-items: center;
        }

        .ccpa-link {
          color: var(--color-primary);
          text-decoration: none;
          font-size: var(--font-size-sm);
          font-weight: 500;
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-primaryBorder);
          transition: all 0.2s ease;
        }

        .ccpa-link:hover {
          background: var(--color-primaryTranslucent);
          border-color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
            padding: var(--spacing-8) 0 var(--spacing-6) 0;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-3);
          }

          .footer-section:first-child {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  )
}
