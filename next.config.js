/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ibcylwmuhxbueknxqrgj.supabase.co',  // Je Supabase URL
      'whiskyforcharity.com',
      'dekoninklijkeloop.nl'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true // Toevoegen voor Vercel deployment
  },
}

module.exports = nextConfig 