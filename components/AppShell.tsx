'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const publicSiteRoutes = new Set([
  '/',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/do-not-sell',
  '/ccpa-privacy-rights',
  '/sharing-policy',
])

function isCmsRoute(pathname: string | null) {
  if (!pathname) return false
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

function isPublicSiteRoute(pathname: string | null) {
  if (!pathname) return false
  return publicSiteRoutes.has(pathname)
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (isCmsRoute(pathname)) {
    return (
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-container">
            <a href="/admin" className="nav-logo">
              <img src="/marti_logo.png" alt="Marti Logo" className="logo-img" />
              MartiCMS
            </a>
            <div className="nav-links">
              <a href="/admin" className="nav-link">📄 Articles</a>
              <a href="/admin/templates" className="nav-link">🎨 Templates</a>
              <a href="/admin/layout-manager" className="nav-link">⚙️ Layout</a>
            </div>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    )
  }

  if (isPublicSiteRoute(pathname)) {
    return (
      <div className="public-app-container">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    )
  }

  return <div className="public-app-container">{children}</div>
}
