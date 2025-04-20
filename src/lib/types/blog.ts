// Basis Blog Post type (kan uitgebreid worden met velden uit schema.prisma)
export type Post = {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt?: string | null;
    imageUrl?: string | null;
    published: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    // authorId?: string; // Optioneel, indien relatie met User model
}; 