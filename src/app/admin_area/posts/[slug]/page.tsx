import PostForm from '@/components/admin/PostForm';
import { getPostBySlugForAdmin, updatePostAction } from '@/lib/actions/blog';
import { Container, Title, Alert, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = params;
  const post = await getPostBySlugForAdmin(slug);

  // Als de post niet gevonden wordt, toon een 404 pagina
  if (!post) {
    notFound(); 
    // Of toon een bericht direct op de pagina:
    // return (
    //   <Container size="md" my="xl">
    //     <Alert title="Fout" color="red" icon={<IconAlertCircle />}>
    //       Blogpost met slug "{slug}" niet gevonden.
    //     </Alert>
    //   </Container>
    // );
  }

  return (
    <Container size="md" my="xl">
       {/* <Title order={1} mb="xl">Blogpost Bewerken: {post.title}</Title> */}
       {/* De formTitle prop in PostForm zorgt al voor een titel binnen de Paper */}
       <PostForm 
        action={updatePostAction} 
        initialData={post} 
        formTitle={`Blogpost Bewerken: ${post.title}`}
      />
    </Container>
  );
} 