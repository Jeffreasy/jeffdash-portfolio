/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false, // Zet dit op false voor betere optimalisatie
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Voeg deze toe voor betere CSS optimalisatie
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
}

module.exports = nextConfig 