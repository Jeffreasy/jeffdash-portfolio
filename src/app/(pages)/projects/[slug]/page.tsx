import React from 'react';

// Params type to access the slug
type Props = {
  params: { slug: string };
};

export default function ProjectDetailPage({ params }: Props) {
  return <div>Project Detail Page for: {params.slug}</div>;
} 