'use client'

import Link from 'next/link'

const ACCENTS = ['aqua', 'blue', 'sand', 'charcoal'] as const
type Accent = (typeof ACCENTS)[number]

export interface ArticleCard {
  slug: string
  category: string
  accent: Accent
  imageLabel: string
  title: string
  summary: string
  readTime: string
  isReal: boolean
  featuredImage?: string
}

const categoryCards = [
  'Kitchen Appliances',
  'Mattresses',
  'Pools',
  'Vacuums',
  'Home Security',
]

const imgStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const imgWrapBase: React.CSSProperties = {
  alignItems: 'flex-end',
  display: 'flex',
  overflow: 'hidden',
  padding: '20px 24px',
  position: 'relative',
}

function CardVisual({
  article,
  size,
}: {
  article: ArticleCard
  size: 'large' | 'medium'
}) {
  if (article.featuredImage) {
    return (
      <div
        style={{
          ...imgWrapBase,
          minHeight: size === 'large' ? '100%' : '200px',
        }}
      >
        <img src={article.featuredImage} alt={article.title} style={imgStyle} />
        {/* gradient scrim so label stays legible */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
          }}
        />
        <span className="visual-label" style={{ position: 'relative', zIndex: 1 }}>
          {article.category}
        </span>
      </div>
    )
  }
  return (
    <div className={`card-visual ${size} ${article.accent}`}>
      <span className="visual-label">{article.imageLabel}</span>
    </div>
  )
}

export default function HomePageContent({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) {
    return (
      <div className="reviews-home">
        <section className="hero-section">
          <div className="page-container">
            <div className="hero-inner">
              <h1>Smart Reviews.<br />Best Prices.</h1>
              <p className="hero-sub">New guides are on the way. Check back soon.</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const [featured, ...rest] = articles

  return (
    <div className="reviews-home">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="page-container">
          <div className="hero-inner">
            <h1>Smart Reviews.<br />Best Prices.</h1>
            <p className="hero-sub">
              Practical buying guides for air purifiers, smart home gear, lawn tools, pressure washers, water filters, and more.
              We cut through the noise so you can decide faster.
            </p>
          </div>
        </div>
      </section>

      {/* ── GUIDES ── */}
      <div className="page-container" id="guides">

        <div className="section-label">
          <span className="eyebrow">Latest Guides</span>
          <h2 className="section-title">Featured Reviews</h2>
        </div>

        {/* Featured card — full width */}
        <article className="card-featured">
          <CardVisual article={featured} size="large" />
          <div className="card-body featured-body">
            <div className="card-top">
              <span className="badge">{featured.category}</span>
              {featured.readTime && <span className="read-time">{featured.readTime}</span>}
            </div>
            <h3 className="card-title">{featured.title}</h3>
            <p className="card-summary">{featured.summary}</p>
            {featured.isReal ? (
              <Link href={`/${featured.slug}`} className="card-link">Read full review →</Link>
            ) : (
              <span className="card-link coming">Coming soon</span>
            )}
          </div>
        </article>

        {/* Remaining cards — 3-column row */}
        <div className="card-row">
          {rest.map((article) => (
            <article className="card-standard" key={article.slug}>
              <CardVisual article={article} size="medium" />
              <div className="card-body">
                <div className="card-top">
                  <span className="badge">{article.category}</span>
                  {article.readTime && <span className="read-time">{article.readTime}</span>}
                </div>
                <h3 className="card-title">{article.title}</h3>
                <p className="card-summary">{article.summary}</p>
                {article.isReal ? (
                  <Link href={`/${article.slug}`} className="card-link">Read full review →</Link>
                ) : (
                  <span className="card-link coming">Coming soon</span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Category chips */}
        <div className="categories-block">
          <span className="eyebrow">More Categories</span>
          <div className="category-chips">
            {categoryCards.map((cat) => (
              <span className="chip" key={cat}>{cat}</span>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div className="cta-bar">
          <div className="cta-bar-text">
            <span className="eyebrow white">Stay in the loop</span>
            <h2>New guides, cleaner comparisons, fewer shopping mistakes.</h2>
          </div>
          <Link href="/contact" className="cta-inverted">Suggest a Topic</Link>
        </div>

      </div>

      <style jsx>{`
        /* Brand: Orange #E8470A  |  Navy #1A2644  |  Cream bg #FFF8F0 */

        .reviews-home {
          background: linear-gradient(180deg, #fff8f0 0%, #fff3e6 40%, #ffffff 100%);
          min-height: 100vh;
        }

        .page-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* ── Hero ── */
        .hero-section {
          padding: 72px 0 48px;
          text-align: center;
        }

        .hero-inner {
          max-width: 780px;
          margin: 0 auto;
        }

        .hero-inner h1 {
          font-size: clamp(3.2rem, 7vw, 6.4rem);
          font-weight: 900;
          color: #1A2644;
          line-height: 0.93;
          letter-spacing: -0.055em;
          margin: 0 0 24px;
        }

        .hero-sub {
          font-size: clamp(1.05rem, 2vw, 1.28rem);
          color: rgba(26,38,68,0.6);
          line-height: 1.65;
          margin: 0 auto;
          max-width: 580px;
        }

        /* ── Section label ── */
        .section-label {
          padding: 52px 0 28px;
        }

        .eyebrow {
          color: #E8470A;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .eyebrow.white {
          color: rgba(255,255,255,0.62);
        }

        .section-title {
          color: #1A2644;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }

        /* ── Gradient card visual panels ── */
        .card-visual {
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding: 20px 24px;
          position: relative;
        }

        /* gradient decorative rings */
        .card-visual::before {
          content: '';
          position: absolute;
          width: 140px; height: 140px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.36);
          top: -28px; right: -28px;
        }

        .card-visual::after {
          content: '';
          position: absolute;
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.22);
          top: 60px; right: 40px;
        }

        .card-visual.large  { min-height: 100%; }
        .card-visual.medium { min-height: 200px; }

        .aqua     { background: linear-gradient(135deg, #1a5c65 0%, #3d9ea8 100%); }
        .blue     { background: linear-gradient(135deg, #1a3460 0%, #4a80b8 100%); }
        .sand     { background: linear-gradient(135deg, #7a4e1e 0%, #c9943a 100%); }
        .charcoal {
          background: radial-gradient(circle at 70% 20%, rgba(232,71,10,0.5), transparent 10rem),
                      linear-gradient(135deg, #111111 0%, #2e2e2e 100%);
        }

        .visual-label {
          color: rgba(255,255,255,0.9);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        /* ── Featured card ── */
        .card-featured {
          background: #ffffff;
          border: 1px solid rgba(26,38,68,0.08);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(26,38,68,0.08);
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          margin-bottom: 20px;
          overflow: hidden;
          min-height: 400px;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          padding: 32px 36px;
        }

        .featured-body {
          padding: 48px 52px;
          justify-content: center;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .badge {
          background: rgba(232,71,10,0.1);
          border-radius: 999px;
          color: #E8470A;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          padding: 4px 12px;
          text-transform: uppercase;
        }

        .read-time {
          color: rgba(26,38,68,0.42);
          font-size: 12px;
          font-weight: 600;
        }

        .card-title {
          color: #1A2644;
          font-size: clamp(1.4rem, 2.4vw, 2.1rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0 0 16px;
        }

        .card-standard .card-title {
          font-size: clamp(1.05rem, 1.6vw, 1.4rem);
        }

        .card-summary {
          color: rgba(26,38,68,0.6);
          font-size: 15px;
          line-height: 1.62;
          margin: 0 0 28px;
          flex-grow: 1;
        }

        .card-link {
          align-self: flex-start;
          color: #E8470A;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
        }

        .card-link:hover { text-decoration: underline; }

        .card-link.coming {
          color: rgba(26,38,68,0.32);
          cursor: default;
          font-size: 13px;
        }

        /* ── 4-card row (2x2) ── */
        .card-row {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-bottom: 48px;
        }

        .card-standard {
          background: #ffffff;
          border: 1px solid rgba(26,38,68,0.08);
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(26,38,68,0.07);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Categories ── */
        .categories-block { margin-bottom: 48px; }

        .category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }

        .chip {
          background: #ffffff;
          border: 1.5px solid rgba(26,38,68,0.12);
          border-radius: 999px;
          color: #1A2644;
          cursor: default;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 20px;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
        }

        .chip:hover {
          border-color: #E8470A;
          color: #E8470A;
          background: rgba(232,71,10,0.04);
        }

        /* ── CTA bar ── */
        .cta-bar {
          background: radial-gradient(circle at 90% 18%, rgba(232,71,10,0.4), transparent 14rem),
                      #1A2644;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          padding: 52px 56px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }

        .cta-bar-text h2 {
          color: #ffffff;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0;
          max-width: 600px;
        }

        .cta-inverted {
          align-items: center;
          background: #ffffff;
          border-radius: 999px;
          color: #E8470A;
          display: inline-flex;
          flex-shrink: 0;
          font-size: 15px;
          font-weight: 800;
          justify-content: center;
          min-height: 52px;
          padding: 0 28px;
          text-decoration: none;
          transition: background 0.18s, transform 0.18s;
        }

        .cta-inverted:hover {
          background: #fff0e8;
          transform: translateY(-2px);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .card-featured {
            grid-template-columns: 1fr;
          }
          .card-visual.large { min-height: 240px; }
          .featured-body { padding: 28px 28px 36px; }
          .card-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .page-container { padding: 0 16px; }
          .hero-section { padding: 52px 0 40px; }
          .cta-bar {
            flex-direction: column;
            padding: 36px 28px;
            align-items: flex-start;
          }
          .cta-inverted { width: 100%; }
        }
      `}</style>
    </div>
  )
}
