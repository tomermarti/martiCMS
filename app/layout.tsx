import '../global.css'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

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
        <div className="app-container">
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  )
}

