import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/articles', destination: '/admin', permanent: false },
      { source: '/articles/:path*', destination: '/admin/articles/:path*', permanent: false },
      { source: '/templates', destination: '/admin/templates', permanent: false },
      { source: '/layout-manager', destination: '/admin/layout-manager', permanent: false },
    ]
  },
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Exclude mixpanel-browser from server-side bundles
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('mixpanel-browser')
    }
    return config
  },
}

export default nextConfig

