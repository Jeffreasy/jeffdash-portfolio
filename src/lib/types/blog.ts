import { z } from 'zod';

// Blog post schema with validation
export const PostSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  published: z.boolean(),
  publishedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // authorId: z.string().uuid().optional(), // Uncomment when User model is implemented
});

// Type inference from schema
export type Post = z.infer<typeof PostSchema>;

// Blog post creation schema (without auto-generated fields)
export const CreatePostSchema = PostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreatePost = z.infer<typeof CreatePostSchema>;

// Blog post update schema (all fields optional except id)
export const UpdatePostSchema = CreatePostSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdatePost = z.infer<typeof UpdatePostSchema>;

// Blog post query schema for filtering
export const PostQuerySchema = z.object({
  published: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PostQuery = z.infer<typeof PostQuerySchema>; 