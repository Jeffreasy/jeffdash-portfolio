import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ['your-domain.com'], // Voeg domains toe waar je externe afbeeldingen van laadt
  },
  // Voeg GZIP compressie toe
  compress: true,
};

export default nextConfig;
