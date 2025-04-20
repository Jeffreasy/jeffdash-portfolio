import React from 'react';

// Tijdelijk 'any' gebruiken voor debuggen van de build error
export default function ProjectDetailPage({ params }: any) {
  // Voeg optional chaining toe voor veiligheid
  return <div>Project Detail Page for: {params?.slug || 'unknown slug'}</div>;
} 