import React from 'react';

// Use inline type for props, removing custom Props, PageParams, SearchParams
export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  // We only need params for this example, so searchParams can be omitted
  // if not used, to keep the component signature minimal.
  return <div>Blog Post Detail Page for: {params.slug}</div>;
} 