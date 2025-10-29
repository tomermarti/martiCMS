export const metadata = {
  title: 'About Us - MartiDeals',
  description: 'Learn about MartiDeals - your trusted source for the best deals and shopping experiences online.',
}

export default function AboutUs() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--spacing-4)' }}>
      <div className="about-page">
        <header className="page-header">
          <h1>About MartiDeals</h1>
          <p className="subtitle">Your trusted source for the best deals and shopping experiences</p>
        </header>

        <div className="content">
          <section>
            <h2>🎯 Our Mission</h2>
            <p>
              At MartiDeals, we're dedicated to simplifying your shopping experience by bringing you the best deals, 
              honest reviews, and carefully curated product recommendations. We help millions of consumers make 
              informed purchasing decisions while saving money on quality products.
            </p>
          </section>

          <section>
            <h2>🛍️ What We Do</h2>
            <p>
              MartiDeals helps simplify shopping experiences for online consumers through our comprehensive 
              platform that features:
            </p>
            <ul>
              <li><strong>Curated Deal Discovery:</strong> We scout the internet for the best deals and discounts</li>
              <li><strong>Product Reviews:</strong> Honest, detailed reviews to help you make informed decisions</li>
              <li><strong>Price Comparisons:</strong> Compare prices across multiple retailers</li>
              <li><strong>Expert Recommendations:</strong> Our team of shopping experts recommend the best products</li>
              <li><strong>Seasonal Guides:</strong> Timely buying guides for holidays and special occasions</li>
            </ul>
          </section>

          <section>
            <h2>📊 Our Impact</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <h3>2.5M+</h3>
                <p>People assisted in the last 30 days</p>
              </div>
              <div className="stat-item">
                <h3>$50M+</h3>
                <p>Total savings delivered to customers</p>
              </div>
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Products reviewed and recommended</p>
              </div>
              <div className="stat-item">
                <h3>99%</h3>
                <p>Customer satisfaction rate</p>
              </div>
            </div>
          </section>

          <section>
            <h2>🔍 Our Process</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Research & Discovery</h4>
                  <p>Our team continuously monitors thousands of retailers and brands to identify the best deals and trending products.</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Testing & Verification</h4>
                  <p>We personally test products and verify deals to ensure quality and authenticity before recommending them.</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Expert Review</h4>
                  <p>Our shopping experts analyze each product's features, value proposition, and customer feedback.</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Recommendation</h4>
                  <p>Only the best deals and products that meet our strict criteria make it to our platform.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2>🏆 Why Choose MartiDeals?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h4>🔒 Trusted & Secure</h4>
                <p>We prioritize your privacy and security with industry-leading protection measures.</p>
              </div>
              
              <div className="feature-item">
                <h4>💰 Guaranteed Savings</h4>
                <p>Every deal is verified to ensure you're getting genuine discounts and value.</p>
              </div>
              
              <div className="feature-item">
                <h4>⚡ Real-Time Updates</h4>
                <p>Our deals are updated in real-time so you never miss out on limited-time offers.</p>
              </div>
              
              <div className="feature-item">
                <h4>🎯 Personalized</h4>
                <p>Get recommendations tailored to your interests and shopping preferences.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>👥 Our Team</h2>
            <p>
              MartiDeals is powered by a passionate team of shopping experts, deal hunters, and technology 
              professionals who are committed to helping you save money and make better purchasing decisions. 
              Our team combines years of e-commerce experience with cutting-edge technology to deliver the 
              best possible shopping experience.
            </p>
          </section>

          <section>
            <h2>🌟 Our Values</h2>
            <ul>
              <li><strong>Transparency:</strong> We're honest about our recommendations and affiliate relationships</li>
              <li><strong>Quality:</strong> We only recommend products and deals that meet our high standards</li>
              <li><strong>Privacy:</strong> Your personal information is protected and never sold to third parties</li>
              <li><strong>Customer First:</strong> Every decision we make prioritizes your shopping experience</li>
              <li><strong>Innovation:</strong> We continuously improve our platform to serve you better</li>
            </ul>
          </section>

          <section>
            <h2>📞 Get in Touch</h2>
            <p>
              Have questions, suggestions, or feedback? We'd love to hear from you! Our customer support 
              team is available to help you with any questions about deals, products, or our platform.
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:hello@martideals.com">hello@martideals.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@martideals.com">support@martideals.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:1-800-MARTI-01">1-800-MARTI-01</a></p>
              <p><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM PST</p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .about-page {
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

        section ul {
          color: var(--color-secondaryLabel);
          padding-left: var(--spacing-6);
          margin: 0 0 var(--spacing-4) 0;
        }

        section li {
          margin-bottom: var(--spacing-2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .stat-item {
          text-align: center;
          padding: var(--spacing-6);
          background: var(--color-primaryTranslucent);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-primaryBorder);
        }

        .stat-item h3 {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-primary);
          margin: 0 0 var(--spacing-2) 0;
        }

        .stat-item p {
          margin: 0;
          font-weight: 500;
        }

        .process-steps {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .process-step {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-4);
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: var(--font-size-lg);
          flex-shrink: 0;
        }

        .step-content h4 {
          margin-bottom: var(--spacing-2);
        }

        .step-content p {
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-4);
          margin-top: var(--spacing-4);
        }

        .feature-item {
          padding: var(--spacing-4);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .feature-item h4 {
          margin-bottom: var(--spacing-2);
        }

        .feature-item p {
          margin: 0;
        }

        .contact-info {
          background: var(--color-secondarySystemBackground);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
          margin-top: var(--spacing-4);
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

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .process-step {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
