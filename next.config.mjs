import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Voeg hier eventuele Next.js configuratie opties toe
  // Bijvoorbeeld:
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // port: '', // Optioneel: poortnummer indien nodig
        // pathname: '/account123/**', // Optioneel: specifiek pad indien nodig
      },
      // Voeg hier eventueel andere vertrouwde hostnames toe
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Ook toevoegen voor de placeholder in ProjectCard
      },
    ],
  },
  // Voeg deze configuratie toe voor dynamische routes
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'jeffdash-portfolio.vercel.app'],
    },
    // Disable webpackBuildWorker due to module resolution issues
    // webpackBuildWorker: true,
  },
  // Webpack optimizations to reduce cache warnings
  webpack: (config, { isServer, dev }) => {
    // Optimize chunk splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Split vendor code into separate chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            maxSize: 100000, // 100KB chunks max
          },
          // Split Mantine components
          mantine: {
            test: /[\\/]node_modules[\\/]@mantine[\\/]/,
            name: 'mantine',
            priority: 20,
            chunks: 'all',
            maxSize: 100000,
          },
          // Split icons separately
          icons: {
            test: /[\\/]node_modules[\\/]@tabler[\\/]icons-react[\\/]/,
            name: 'icons',
            priority: 20,
            chunks: 'all',
            maxSize: 50000,
          },
        },
      };
    }

    // Optimize cache configuration for production
    if (!dev) {
      // Reduce cache serialization warnings
      config.cache = {
        ...config.cache,
        compression: 'gzip',
        maxAge: 5184000000, // 60 days
        maxMemoryGenerations: 1,
      };
    }
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig); 