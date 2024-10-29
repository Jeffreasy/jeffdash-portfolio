/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Voeg webpack configuratie toe voor CSS
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
  // Zorg dat CSS modules correct werken
  cssModules: true,
  // Voeg deze toe voor betere asset handling
  assetPrefix: '.',
}

module.exports = nextConfig 