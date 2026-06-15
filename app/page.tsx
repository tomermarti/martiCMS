'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="main-content">
      <div className="page-container">
        <section className="hero">
          <div className="hero-content">
            <h1>Discover the Best Deals Online</h1>
            <p className="hero-subtitle">
              MartiDeals helps you save money with curated deals, honest reviews,
              and expert shopping recommendations.
            </p>
            <div className="hero-actions">
              <Link href="/about" className="btn btn-primary btn-large">
                Learn More
              </Link>
              <Link href="/contact" className="btn btn-outlined btn-large">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>2.5M+</h3>
              <p>Shoppers helped monthly</p>
            </div>
            <div className="stat-item">
              <h3>$50M+</h3>
              <p>Total savings delivered</p>
            </div>
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Products reviewed</p>
            </div>
            <div className="stat-item">
              <h3>99%</h3>
              <p>Customer satisfaction</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Why Shop with MartiDeals?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <h3>Curated Deals</h3>
              <p>We scout thousands of retailers to find genuine discounts and limited-time offers.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⭐</span>
              <h3>Expert Reviews</h3>
              <p>Honest, detailed product reviews so you can buy with confidence.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3>Real Savings</h3>
              <p>Every deal is verified to ensure you get genuine value for your money.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Trusted & Secure</h3>
              <p>Your privacy is protected. We never sell your personal information.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Start Saving?</h2>
          <p>Join millions of smart shoppers who trust MartiDeals for the best deals online.</p>
          <Link href="/about" className="btn btn-primary btn-large">
            About MartiDeals
          </Link>
        </section>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        .hero {
          text-align: center;
          padding: var(--spacing-12) 0 var(--spacing-10);
        }

        .hero h1 {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-label);
          margin: 0 0 var(--spacing-4) 0;
          font-family: var(--font-family-display);
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-secondaryLabel);
          max-width: 600px;
          margin: 0 auto var(--spacing-8);
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-4);
          justify-content: center;
          flex-wrap: wrap;
        }

        .stats-section {
          padding: var(--spacing-8) 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
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
          color: var(--color-secondaryLabel);
          font-weight: 500;
        }

        .features-section {
          padding: var(--spacing-10) 0;
        }

        .features-section h2 {
          text-align: center;
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-label);
          margin: 0 0 var(--spacing-8) 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-6);
        }

        .feature-card {
          padding: var(--spacing-6);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
          text-align: center;
        }

        .feature-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--spacing-3);
        }

        .feature-card h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-2) 0;
        }

        .feature-card p {
          color: var(--color-secondaryLabel);
          margin: 0;
          line-height: 1.5;
        }

        .cta-section {
          text-align: center;
          padding: var(--spacing-10) 0 var(--spacing-12);
          background: var(--color-secondarySystemBackground);
          border-radius: var(--border-radius);
          margin-bottom: var(--spacing-8);
        }

        .cta-section h2 {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-label);
          margin: 0 0 var(--spacing-3) 0;
        }

        .cta-section p {
          color: var(--color-secondaryLabel);
          margin: 0 0 var(--spacing-6) 0;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: var(--font-size-2xl);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
