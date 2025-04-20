import React from 'react';

// Define types for params and searchParams
type PageParams = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

// Define the Props type using the above types
type Props = {
  params: PageParams;
  searchParams: SearchParams;
};

// Explicitly type the component with React.FC
const BlogDetailPage: React.FC<Props> = ({ params }) => {
  return <div>Blog Post Detail Page for: {params.slug}</div>;
};

export default BlogDetailPage; 