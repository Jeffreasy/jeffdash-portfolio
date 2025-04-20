import React from 'react';

// Tijdelijk 'any' gebruiken voor debuggen van de build error
export default function BlogDetailPage({ params }: any) {
  return <div>Blog Post Detail Page for: {params?.slug || 'unknown slug'}</div>;
} 