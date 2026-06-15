import '../global.css'
import MixpanelProvider from '@/components/MixpanelProvider'
import AppShell from '@/components/AppShell'

export const metadata = {
  title: 'MartiDeals - Your Trusted Source for the Best Deals',
  description: 'Discover curated deals, honest reviews, and expert shopping recommendations at MartiDeals.com',
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
      <body suppressHydrationWarning>
        <MixpanelProvider>
          <AppShell>{children}</AppShell>
        </MixpanelProvider>
        
      </body>
    </html>
  )
}

