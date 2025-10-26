import '../global.css'

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
      <body>{children}</body>
    </html>
  )
}

