import React from 'react';
import Card from '@/components/ui/Card';

// Definieer een basis type voor Post data
type Post = {
  id: string;
  title: string;
  imageUrl?: string;
  excerpt?: string;
  slug: string;
  publishedAt: Date;
};

type BlogPostCardProps = {
  post: Post;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="mb-2" />}
      <h3 className="font-bold">{post.title}</h3>
      <p className="text-xs text-gray-500 mb-1">{post.publishedAt.toLocaleDateString()}</p>
      {post.excerpt && <p className="text-sm text-gray-600">{post.excerpt}</p>}
      {/* Voeg hier een Link toe naar /blog/[slug] */}
    </Card>
  );
} 