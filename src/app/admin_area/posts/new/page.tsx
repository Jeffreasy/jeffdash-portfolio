import PostForm from '@/components/admin/PostForm';
import { createPostAction } from '@/lib/actions/blog';
import { Container, Title } from '@mantine/core';

export default function NewPostPage() {
  return (
    <Container size="md" my="xl">
      {/* <Title order={1} mb="xl">Nieuwe Blogpost Aanmaken</Title> */}
      {/* De formTitle prop in PostForm zorgt al voor een titel binnen de Paper */}
      <PostForm 
        action={createPostAction} 
        formTitle="Nieuwe Blogpost Aanmaken" 
      />
    </Container>
  );
} 