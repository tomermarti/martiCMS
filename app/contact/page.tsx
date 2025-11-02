'use client'

export default function Contact() {
  return (
    <div className="main-content">
      <div className="page-container">
        <div className="contact-page">
        <header className="page-header">
          <h1>Contact Us</h1>
          <p className="subtitle">We're here to help! Get in touch with our team</p>
        </header>

        <div className="content">
          <section>
            <h2>📞 Get in Touch</h2>
            <p>
              Have questions, suggestions, or need support? Our team is ready to assist you. 
              Choose the best way to reach us based on your needs.
            </p>
          </section>

          <div className="contact-methods">
            <div className="contact-method primary">
              <div className="method-icon">📧</div>
              <div className="method-content">
                <h3>Email Support</h3>
                <p>Get detailed help via email. We typically respond within 24 hours.</p>
                <div className="contact-details">
                  <p><strong>General Support:</strong> <a href="mailto:support@martideals.com">support@martideals.com</a></p>
                  <p><strong>Business Inquiries:</strong> <a href="mailto:business@martideals.com">business@martideals.com</a></p>
                  <p><strong>Privacy Questions:</strong> <a href="mailto:privacy@martideals.com">privacy@martideals.com</a></p>
                </div>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">📱</div>
              <div className="method-content">
                <h3>Phone Support</h3>
                <p>Speak directly with our support team for immediate assistance.</p>
                <div className="contact-details">
                  <p><strong>Phone:</strong> <a href="tel:1-800-MARTI-01">1-800-MARTI-01</a></p>
                  <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM PST</p>
                  <p><strong>Weekend:</strong> Saturday 10 AM - 4 PM PST</p>
                </div>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">💬</div>
              <div className="method-content">
                <h3>Live Chat</h3>
                <p>Get instant help through our live chat feature on the website.</p>
                <div className="contact-details">
                  <p><strong>Availability:</strong> Monday - Friday, 9 AM - 6 PM PST</p>
                  <p><strong>Response Time:</strong> Usually within 5 minutes</p>
                  <button className="btn btn-primary">Start Live Chat</button>
                </div>
              </div>
            </div>
          </div>

          <section>
            <h2>🏢 Office Information</h2>
            <div className="office-info">
              <div className="office-details">
                <h4>MartiDeals Headquarters</h4>
                <p>
                  123 Commerce Street<br />
                  Suite 456<br />
                  San Francisco, CA 94102<br />
                  United States
                </p>
              </div>
              <div className="office-hours">
                <h4>Business Hours</h4>
                <ul>
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PST</li>
                  <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM PST</li>
                  <li><strong>Sunday:</strong> Closed</li>
                  <li><strong>Holidays:</strong> Limited hours (check website)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>❓ Frequently Asked Questions</h2>
            <div className="faq-items">
              <div className="faq-item">
                <h4>How do I find the best deals?</h4>
                <p>
                  Browse our curated deals on the homepage, use our search feature, or sign up for 
                  our newsletter to get the latest deals delivered to your inbox.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>Are the deals really legitimate?</h4>
                <p>
                  Yes! We verify all deals before posting them. Our team checks prices, availability, 
                  and terms to ensure you're getting genuine savings.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>How do you make money?</h4>
                <p>
                  We earn commissions from retailers when you make purchases through our affiliate links. 
                  This doesn't cost you anything extra and helps us keep the service free.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>Can I submit a deal I found?</h4>
                <p>
                  Absolutely! We love community contributions. Email us at 
                  <a href="mailto:deals@martideals.com">deals@martideals.com</a> with the deal details.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>🤝 Partnership Opportunities</h2>
            <p>
              Interested in partnering with MartiDeals? We work with retailers, brands, and content 
              creators to bring the best deals to our community.
            </p>
            <div className="partnership-types">
              <div className="partnership-type">
                <h4>🏪 Retailers & Brands</h4>
                <p>Feature your products and promotions to our engaged audience of deal seekers.</p>
                <a href="mailto:partnerships@martideals.com" className="btn btn-outlined">Partner With Us</a>
              </div>
              
              <div className="partnership-type">
                <h4>✍️ Content Creators</h4>
                <p>Join our affiliate program and earn commissions by sharing great deals with your audience.</p>
                <a href="mailto:affiliates@martideals.com" className="btn btn-outlined">Join Affiliate Program</a>
              </div>
            </div>
          </section>

          <section>
            <h2>📝 Feedback & Suggestions</h2>
            <p>
              We're always looking to improve! Share your thoughts, suggestions, or report any issues 
              you encounter on our platform.
            </p>
            <div className="feedback-options">
              <div className="feedback-option">
                <h4>💡 Feature Requests</h4>
                <p>Have an idea for a new feature? We'd love to hear it!</p>
                <a href="mailto:feedback@martideals.com">feedback@martideals.com</a>
              </div>
              
              <div className="feedback-option">
                <h4>🐛 Bug Reports</h4>
                <p>Found something that's not working right? Let us know!</p>
                <a href="mailto:bugs@martideals.com">bugs@martideals.com</a>
              </div>
              
              <div className="feedback-option">
                <h4>⭐ Reviews & Testimonials</h4>
                <p>Share your experience with MartiDeals!</p>
                <a href="mailto:reviews@martideals.com">reviews@martideals.com</a>
              </div>
            </div>
          </section>

          <section>
            <h2>🌐 Follow Us</h2>
            <p>Stay connected and get the latest deals and updates on social media:</p>
            <div className="social-links">
              <a href="https://twitter.com/martideals" className="social-link">🐦 Twitter</a>
              <a href="https://facebook.com/martideals" className="social-link">📘 Facebook</a>
              <a href="https://instagram.com/martideals" className="social-link">📷 Instagram</a>
              <a href="https://linkedin.com/company/martideals" className="social-link">💼 LinkedIn</a>
            </div>
          </section>
        </div>
      </div>
    </div>

      <style jsx>{`
        .contact-page {
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

        .subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-secondaryLabel);
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

        section h4 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-2) 0;
        }

        section p {
          color: var(--color-secondaryLabel);
          margin: 0 0 var(--spacing-4) 0;
        }

        .contact-methods {
          display: grid;
          gap: var(--spacing-6);
          margin-top: var(--spacing-4);
        }

        .contact-method {
          display: flex;
          gap: var(--spacing-4);
          padding: var(--spacing-6);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .contact-method.primary {
          background: var(--color-primaryTranslucent);
          border-color: var(--color-primaryBorder);
        }

        .method-icon {
          font-size: var(--font-size-3xl);
          flex-shrink: 0;
        }

        .method-content h3 {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-2) 0;
        }

        .method-content p {
          margin-bottom: var(--spacing-3);
        }

        .contact-details p {
          margin-bottom: var(--spacing-1);
        }

        .office-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-6);
          margin-top: var(--spacing-4);
        }

        .office-details, .office-hours {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .office-hours ul {
          list-style: none;
          padding: 0;
          margin: var(--spacing-3) 0 0 0;
        }

        .office-hours li {
          padding: var(--spacing-1) 0;
          border-bottom: 1px solid var(--color-separator);
        }

        .office-hours li:last-child {
          border-bottom: none;
        }

        .faq-items {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .faq-item {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .faq-item h4 {
          margin-bottom: var(--spacing-2);
          color: var(--color-primary);
        }

        .faq-item p {
          margin: 0;
        }

        .partnership-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .partnership-type {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
          text-align: center;
        }

        .partnership-type h4 {
          margin-bottom: var(--spacing-2);
        }

        .partnership-type p {
          margin-bottom: var(--spacing-4);
        }

        .feedback-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .feedback-option {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .feedback-option h4 {
          margin-bottom: var(--spacing-2);
        }

        .feedback-option p {
          margin-bottom: var(--spacing-2);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-4);
          flex-wrap: wrap;
          margin-top: var(--spacing-4);
        }

        .social-link {
          display: inline-block;
          padding: var(--spacing-3) var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border: 1px solid var(--color-separator);
          border-radius: var(--border-radius);
          text-decoration: none;
          color: var(--color-label);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: var(--color-primaryTranslucent);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .btn {
          display: inline-block;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--border-radius);
          text-decoration: none;
          font-weight: 500;
          text-align: center;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-primary-hover);
        }

        .btn-outlined {
          background: transparent;
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        .btn-outlined:hover {
          background: var(--color-primaryTranslucent);
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

          .contact-method {
            flex-direction: column;
            text-align: center;
          }

          .office-info {
            grid-template-columns: 1fr;
          }

          .partnership-types {
            grid-template-columns: 1fr;
          }

          .feedback-options {
            grid-template-columns: 1fr;
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
