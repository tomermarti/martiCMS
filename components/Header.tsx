'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-brand">
          <Link href="/" className="brand-link">
            <img 
              src="/martideals-logo.svg" 
              alt="MartiDeals Logo" 
              className="brand-logo"
            />
          </Link>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/articles" className="nav-link">Articles</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <style jsx>{`
        .site-header {
          background: var(--color-systemBackground);
          border-bottom: 1px solid var(--color-separator);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .header-brand {
          display: flex;
          align-items: center;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          text-decoration: none;
          color: var(--color-label);
          font-weight: 600;
          font-size: var(--font-size-lg);
        }

        .brand-logo {
          height: 50px;
          width: auto;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-6);
        }

        .nav-link {
          color: var(--color-label);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          background: var(--color-systemFill);
          color: var(--color-primary);
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-2);
          border-radius: var(--border-radius);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          position: relative;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--color-label);
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        .hamburger span:nth-child(1) {
          transform-origin: top left;
        }

        .hamburger span:nth-child(2) {
          margin: 6px 0;
        }

        .hamburger span:nth-child(3) {
          transform-origin: bottom left;
        }

        .hamburger-open span:nth-child(1) {
          transform: rotate(45deg) translate(2px, -2px);
        }

        .hamburger-open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-open span:nth-child(3) {
          transform: rotate(-45deg) translate(2px, 2px);
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }

          .header-nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-systemBackground);
            border-bottom: 1px solid var(--color-separator);
            flex-direction: column;
            padding: var(--spacing-4);
            gap: var(--spacing-2);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-link {
            width: 100%;
            text-align: center;
            padding: var(--spacing-3);
          }
        }
      `}</style>
    </header>
  )
}
