import '../global.css'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import MixpanelProvider from '@/components/MixpanelProvider'

export const metadata = {
  title: 'MartiCMS - Content Management System',
  description: 'Manage your articles and deploy to Digital Ocean Spaces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MixpanelProvider>
          <div className="app-container">
            <nav className="main-nav">
              <div className="nav-container">
                <a href="/" className="nav-logo">
                  <img src="/marti_logo.png" alt="Marti Logo" className="logo-img" />
                  MartiCMS
                </a>
                <div className="nav-links">
                  <a href="/" className="nav-link">📄 Articles</a>
                  <a href="/templates" className="nav-link">🎨 Templates</a>
                </div>
              </div>
            </nav>
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </MixpanelProvider>
        
      </body>
    </html>
  )
}

