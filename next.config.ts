import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
}

export default nextConfig
