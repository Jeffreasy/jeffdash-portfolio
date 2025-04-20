import React from 'react';

// Revert to Props type similar to ProjectDetailPage
type Props = {
  params: { slug: string };
  // searchParams removed for now to match ProjectDetailPage structure
};

export default function BlogDetailPage({ params }: Props) {
  return <div>Blog Post Detail Page for: {params.slug}</div>;
} 