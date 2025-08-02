/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: '3.bp.blogspot.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'roodsappbucket.s3.eu-central-1.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'www.bookmychefs.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  experimental: {
    serverComponentsExternalPackages: ['@mapbox/mapbox-sdk']
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;
