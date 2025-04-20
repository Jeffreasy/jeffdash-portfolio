import React from 'react';

// Params type to access the slug
type Props = {
  params: { slug: string };
};

export default function BlogDetailPage({ params }: Props) {
  return <div>Blog Post Detail Page for: {params.slug}</div>;
} 