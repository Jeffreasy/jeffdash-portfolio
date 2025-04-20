// Basis Project type (kan uitgebreid worden met velden uit schema.prisma)
export type Project = {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    technologies?: string[]; // Array van technologie namen
    createdAt: Date;
    updatedAt: Date;
}; 