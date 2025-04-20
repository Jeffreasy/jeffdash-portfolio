import React from 'react';

// Define types for params and searchParams
type PageParams = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

// Define the Props type using the above types
type Props = {
  params: PageParams;
  searchParams: SearchParams;
};

// Use a standard function component definition
export default function BlogDetailPage({ params }: Props) {
  return <div>Blog Post Detail Page for: {params.slug}</div>;
} 