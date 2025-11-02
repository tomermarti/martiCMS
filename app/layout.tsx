import '../global.css'
import Footer from '@/components/Footer'
import MixpanelProvider from '@/components/MixpanelProvider'

export const metadata = {
  title: 'MartiCMS - Content Management System',
  description: 'Manage your articles and deploy to Digital Ocean Spaces',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/martideals-logo.svg', type: 'image/svg+xml' },
      { url: '/marti_logo.png', type: 'image/png' },
    ],
    apple: '/marti_logo.png',
  },
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
                  <a href="/layout-manager" className="nav-link">⚙️ Layout</a>
                </div>
              </div>
            </nav>
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </MixpanelProvider>
        
      </body>
    </html>
  )
}

