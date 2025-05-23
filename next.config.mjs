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
    serverActions: true,
  },
};

export default nextConfig; 