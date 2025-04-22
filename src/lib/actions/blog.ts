'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma, Post as PrismaPost } from '@prisma/client'; // Gebruik alias
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { validateAdminSession } from './projects'; // Importeer validatie helper

// --- Types --- //
export type { PrismaPost };

// Herdefinieer JwtPayload hier of importeer uit gedeelde types
interface JwtPayload {
  userId: string;
  role: string;
}

// Selecteer velden voor de blog post preview (lijstpagina)
const postPreviewSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  featuredImageUrl: true,
  tags: true,
  category: true,
  publishedAt: true,
  // SEO veld voor alt text van preview image
  featuredImageAltText: true,
} satisfies Prisma.PostSelect;

// Type voor de blog post preview
export type PublishedPostPreviewType = Prisma.PostGetPayload<{ select: typeof postPreviewSelect }>;

// Selecteer alle velden voor de volledige blog post (detailpagina)
const fullPostSelect = {
  id: true,
  slug: true,
  title: true,
  content: true, // Volledige inhoud
  excerpt: true,
  featuredImageUrl: true,
  tags: true,
  category: true,
  published: true,
  publishedAt: true,
  metaTitle: true, // SEO velden
  metaDescription: true,
  featuredImageAltText: true,
  createdAt: true,
  updatedAt: true,
  // author: { select: { name: true } } // Optioneel: selecteer auteur naam als relatie actief is
} satisfies Prisma.PostSelect;

// Type voor de volledige blog post
export type FullPostType = Prisma.PostGetPayload<{ select: typeof fullPostSelect }>;

// Selecteer velden voor de admin post lijst
const adminPostListSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  published: true,
  publishedAt: true,
  createdAt: true,
} satisfies Prisma.PostSelect;

// Type voor de admin post lijst
export type AdminPostListItemType = Prisma.PostGetPayload<{ select: typeof adminPostListSelect }>;

// Selecteer alle velden voor bewerken/details in admin
const fullPostSelectAdmin = {
  id: true,
  slug: true,
  title: true,
  content: true,
  excerpt: true,
  featuredImageUrl: true,
  tags: true,
  category: true,
  published: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  featuredImageAltText: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect;

// Type voor volledige post in admin
export type FullAdminPostType = Prisma.PostGetPayload<{ select: typeof fullPostSelectAdmin }>;

// --- Zod Schema voor Post Validatie --- 
const PostSchema = z.object({
  title: z.string().min(3, { message: 'Titel moet minimaal 3 tekens bevatten.' }),
  slug: z.string().min(3, { message: 'Slug moet minimaal 3 tekens bevatten.' })
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug mag alleen kleine letters, cijfers en koppeltekens bevatten.' }),
  content: z.string().min(10, { message: 'Inhoud moet minimaal 10 tekens bevatten.'}),
  excerpt: z.string().optional(),
  featuredImageUrl: z.string().url({ message: 'Ongeldige URL voor uitgelichte afbeelding.' }).optional().or(z.literal('')),
  featuredImageAltText: z.string().optional(),
  tags: z.preprocess((arg) => {
    if (typeof arg === 'string') return arg.split(',').map(item => item.trim()).filter(Boolean);
    return arg;
  }, z.array(z.string()).optional()),
  category: z.string().optional(),
  published: z.preprocess((arg) => arg === 'on' || arg === true, z.boolean().default(false)),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Type voor de state van de post actions
export type PostFormState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof PostSchema>, string[]>> & { general?: string[] };
  postSlug?: string | null;
};

// --- Actions --- //

/**
 * Haalt ALLE blog posts op voor de admin lijst.
 */
export async function getPosts(): Promise<AdminPostListItemType[]> {
  logger.info('Fetching all posts for admin list');
  try {
    // TODO: Autorisatie check? Of gebeurt dit in de layout/pagina?
    // Voor nu gaan we ervan uit dat de pagina zelf beschermd is.
    const posts = await prisma.post.findMany({
      select: adminPostListSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  } catch (error) {
    logger.error('Failed to fetch posts for admin', { error });
    return [];
  }
}

/**
 * Haalt een enkele post op basis van de slug voor de admin bewerkpagina.
 * Retourneert null als de post niet gevonden wordt.
 */
export async function getPostBySlugForAdmin(slug: string): Promise<FullAdminPostType | null> {
  logger.info('Fetching post for admin edit', { slug });
  if (!slug) return null;

  try {
    // TODO: Autorisatie check?
    const post = await prisma.post.findUnique({
      where: { slug },
      select: fullPostSelectAdmin,
    });
    return post;
  } catch (error) {
    logger.error('Failed to fetch post by slug for admin', { slug, error });
    return null;
  }
}

/**
 * Verwijdert een blog post.
 */
export async function deletePostAction(postId: string): Promise<{ success: boolean; message?: string }> {
  logger.info('Attempting to delete post', { postId });
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for delete action', { userId: session.userId });

    // TODO: Verwijder eventuele gekoppelde resources (bv. afbeelding uit Cloudinary)

    await prisma.post.delete({
      where: { id: postId },
    });

    logger.info('Post successfully deleted', { postId, userId: session.userId });
    revalidatePath('/admin_area/posts'); // Revalideer admin lijst
    revalidatePath('/blog'); // Revalideer publieke lijst
    // TODO: Revalideer specifieke blog post pagina als die bestaat (/blog/[slug])
    return { success: true, message: 'Blog post succesvol verwijderd.' };

  } catch (error: any) {
    logger.error('Failed to delete post', { postId, error: error.message });
    let errorMessage = 'Kon blog post niet verwijderen door een serverfout.';
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      errorMessage = 'Blog post niet gevonden om te verwijderen.';
    } else if (error.message?.startsWith('Unauthorized')) {
      errorMessage = error.message;
    } else if (error.message === 'Server configuration error') {
       errorMessage = 'Server configuratiefout.';
    }
    return { success: false, message: errorMessage };
  }
}

/**
 * Maakt een nieuwe blog post aan.
 */
export async function createPostAction(prevState: PostFormState | undefined, formData: FormData): Promise<PostFormState> {
  logger.info('Create post action initiated');
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for create post action', { userId: session.userId });

    const validatedFields = PostSchema.safeParse({
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      featuredImageUrl: formData.get('featuredImageUrl'),
      featuredImageAltText: formData.get('featuredImageAltText'),
      tags: formData.get('tags'),
      category: formData.get('category'),
      published: formData.get('published'),
      metaTitle: formData.get('metaTitle'),
      metaDescription: formData.get('metaDescription'),
    });

    if (!validatedFields.success) {
      logger.warn('Post validation failed (create)', { errors: validatedFields.error.flatten().fieldErrors });
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: { ...fieldErrors },
      };
    }

    const { published, ...postData } = validatedFields.data;
    const publishDate = published ? new Date() : null; // Zet publicatiedatum alleen als 'published' is aangevinkt

    logger.info('Creating post in database', { slug: postData.slug });
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        published,
        publishedAt: publishDate,
      },
    });

    logger.info('Post successfully created', { postId: newPost.id, userId: session.userId });

  } catch (error: any) {
     logger.error('Failed to create post', { error: error.message });
     let errorMessage = 'Kon blog post niet aanmaken door een serverfout.';
     let errors: PostFormState['errors'] = {}; // Start met leeg object

     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        if ((error.meta?.target as string[])?.includes('slug')) {
           errorMessage = 'Deze slug bestaat al.';
           errors = { slug: [errorMessage] }; // Direct toewijzen
        }
     } else if (error.message?.startsWith('Unauthorized')) {
         errorMessage = error.message;
         errors = { general: [errorMessage] }; // Direct toewijzen
     } else if (error.message === 'Server configuration error') {
         errorMessage = 'Server configuratiefout.';
         errors = { general: [errorMessage] }; // Direct toewijzen
     } else if (error instanceof z.ZodError) {
         errorMessage = 'Validatiefouten.';
         errors = { ...error.flatten().fieldErrors }; // Spread fieldErrors
     } else {
       // Algemene serverfout of onbekende fout
       errorMessage = error.message || errorMessage;
       errors = { general: [errorMessage] };
     }

     // Return het correct opgebouwde object
     return { success: false, message: errorMessage, errors };
   }

  // Revalidate paden
  revalidatePath('/admin_area/posts');
  revalidatePath('/blog');
  // TODO: Revalideer specifieke blog post pagina als die bestaat (/blog/[slug])

  redirect('/admin_area/posts');
}

/**
 * Werkt een bestaande blog post bij.
 */
export async function updatePostAction(prevState: PostFormState | undefined, formData: FormData): Promise<PostFormState> {
  logger.info('Update post action initiated');
  const postId = formData.get('postId') as string;
   if (!postId) {
     return { success: false, message: 'Post ID ontbreekt.', errors: { general: ['Post ID ontbreekt.'] } };
   }
   logger.info('Attempting to update post', { postId });
   const currentSlug = formData.get('slug') as string | null; // Sla huidige slug op voor return bij error

   try {
     const session = await validateAdminSession();
     logger.info('Admin session validated for update post action', { userId: session.userId, postId });

     const validatedFields = PostSchema.safeParse({
       title: formData.get('title'),
       slug: formData.get('slug'),
       content: formData.get('content'),
       excerpt: formData.get('excerpt'),
       featuredImageUrl: formData.get('featuredImageUrl'),
       featuredImageAltText: formData.get('featuredImageAltText'),
       tags: formData.get('tags'),
       category: formData.get('category'),
       published: formData.get('published'),
       metaTitle: formData.get('metaTitle'),
       metaDescription: formData.get('metaDescription'),
     });

     if (!validatedFields.success) {
       logger.warn('Post validation failed (update)', { postId, errors: validatedFields.error.flatten().fieldErrors });
       const fieldErrors = validatedFields.error.flatten().fieldErrors;
       return {
         success: false,
         message: 'Validatiefouten gevonden.',
         errors: { ...fieldErrors },
         postSlug: currentSlug // Geef slug terug voor formulier
       };
     }

     const { published, ...postData } = validatedFields.data;

     // Bepaal publicatiedatum:
     // - Als post al gepubliceerd was, behoud de datum.
     // - Als post nu gepubliceerd wordt (en nog niet was), zet huidige datum.
     // - Als post gedepubliceerd wordt, zet datum op null.
     const existingPost = await prisma.post.findUnique({ where: { id: postId }, select: { publishedAt: true, published: true } });
     let publishDate: Date | null;
     if (published && !existingPost?.published) {
       publishDate = new Date(); // Wordt nu gepubliceerd
     } else if (!published) {
       publishDate = null; // Wordt gedepubliceerd
     } else {
       publishDate = existingPost?.publishedAt ?? null; // Behoud bestaande datum of null
     }

     logger.info('Updating post in database', { postId, slug: postData.slug });
     const updatedPost = await prisma.post.update({
       where: { id: postId },
       data: {
         ...postData,
         published,
         publishedAt: publishDate,
       },
     });

     logger.info('Post successfully updated', { postId: updatedPost.id, userId: session.userId });

   } catch (error: any) {
     logger.error('Failed to update post', { postId, error: error.message });
     let errorMessage = 'Kon blog post niet bijwerken door een serverfout.';
     let errors: PostFormState['errors'] = {}; // Start met leeg object

     if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('slug')) {
          errorMessage = 'Deze slug bestaat al.';
          errors = { slug: [errorMessage] }; // Direct toewijzen
        } else if (error.code === 'P2025') {
          errorMessage = 'Te bewerken post niet gevonden.';
          errors = { general: [errorMessage] }; // Direct toewijzen
        }
     } else if (error.message?.startsWith('Unauthorized')) {
         errorMessage = error.message;
         errors = { general: [errorMessage] }; // Direct toewijzen
     } else if (error.message === 'Server configuration error') {
         errorMessage = 'Server configuratiefout.';
         errors = { general: [errorMessage] }; // Direct toewijzen
     } else if (error instanceof z.ZodError) {
         errorMessage = 'Validatiefouten.';
         errors = { ...error.flatten().fieldErrors }; // Spread fieldErrors
     } else {
        // Algemene serverfout of onbekende fout
        errorMessage = error.message || errorMessage;
        errors = { general: [errorMessage] };
     }

     // Return het correct opgebouwde object
     return { success: false, message: errorMessage, errors, postSlug: currentSlug }; // Geef slug terug
   }

   // Revalidate paden
   const finalSlug = formData.get('slug') as string;
   revalidatePath('/admin_area/posts');
   revalidatePath('/blog');
   if (finalSlug) {
     revalidatePath(`/blog/${finalSlug}`);
     revalidatePath(`/admin_area/posts/${finalSlug}`); // Revalideer ook admin bewerkpagina
   }

   redirect('/admin_area/posts');
}

// --- Functies voor publieke site (getPublishedPosts, getPostBySlug) --- //

/**
 * Haalt een lijst van gepubliceerde blog posts op.
 */
export async function getPublishedPosts(): Promise<PublishedPostPreviewType[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: postPreviewSelect,
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return posts;
  } catch (error) {
    logger.error('Failed to fetch published posts', { error });
    return [];
  }
}

/**
 * Haalt een enkele gepubliceerde blog post op basis van de slug.
 * Retourneert null als de post niet gevonden wordt of niet gepubliceerd is.
 */
export async function getPostBySlug(slug: string): Promise<FullPostType | null> {
  if (!slug) return null;

  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
        published: true,
      },
      select: fullPostSelect,
    });
    return post;
  } catch (error) {
    logger.error('Failed to fetch post by slug', { slug, error });
    return null;
  }
} 