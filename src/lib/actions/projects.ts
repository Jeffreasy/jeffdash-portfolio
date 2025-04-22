'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; // Importeer revalidatePath
// Importeer de Prisma namespace EN de model types
import { Prisma } from '@prisma/client'; // Import Prisma namespace
import type { Project } from '@prisma/client'; // Import Project type
export type PrismaProject = Project; // Alias and Export Project as PrismaProject
import { z } from 'zod'; // Importeer Zod
import { redirect } from 'next/navigation'; // Importeer redirect
import cloudinary from '@/lib/cloudinary'; // Importeer Cloudinary config
import streamifier from 'streamifier'; // Nodig om buffer naar stream te converteren
import { cookies } from 'next/headers'; // Importeer cookies
import jwt from 'jsonwebtoken'; // Importeer JWT

// Definieer een type voor de data die we nodig hebben in de findMany call
// Gebruik de namespace voor Prisma types
const featuredProjectSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  technologies: true,
  images: {
    select: {
      url: true,
      altText: true,
    },
    orderBy: {
      order: 'asc' as const,
    },
    take: 1,
  },
} satisfies Prisma.ProjectSelect;

// Afgeleid type van de select query
// Gebruik de namespace
type FetchedProjectType = Prisma.ProjectGetPayload<{ select: typeof featuredProjectSelect }>;

// Definieer het uiteindelijke type dat we teruggeven
export type FeaturedProjectType = FetchedProjectType & {
  featuredImageUrl?: string;
  featuredImageAlt?: string;
};

export async function getFeaturedProjects(): Promise<{
  featuredProjects: FeaturedProjectType[];
  totalProjectCount: number;
}> {
  try {
    const projectsData = await prisma.project.findMany({
      where: {
        isFeatured: true,
      },
      select: featuredProjectSelect,
      orderBy: {
         createdAt: 'desc' as const,
      },
      take: 3,
    });

    // Laat TypeScript het type van 'project' afleiden in de map
    // Type de parameter expliciet om de linter error op te lossen
    const featuredProjects: FeaturedProjectType[] = projectsData.map((project: FetchedProjectType) => ({
      ...project,
      featuredImageUrl: project.images[0]?.url,
      featuredImageAlt: project.images[0]?.altText ?? project.title,
    }));

    const totalProjectCount = await prisma.project.count();

    return {
      featuredProjects,
      totalProjectCount,
    };
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
    return { featuredProjects: [], totalProjectCount: 0 };
  }
}

// Placeholder voor het ophalen van projecten
// Gebruik PrismaProject voor het return type
export async function getProjects(): Promise<PrismaProject[]> { // Update return type
  console.log('Fetching projects...');
  try {
    // Implementeer daadwerkelijke fetch, inclusief benodigde velden
    return await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // Selecteer eventueel specifieke velden voor de lijstpagina
      // select: { ... }
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // Return lege array bij fout
  }
}

// Placeholder voor het ophalen van een enkel project
// Definieer een selectie voor alle benodigde velden
// Gebruik de namespace
const fullProjectSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  detailedContent: true,
  liveUrl: true,
  githubUrl: true,
  technologies: true,
  category: true,
  isFeatured: true,
  metaTitle: true,
  metaDescription: true,
  createdAt: true,
  images: {
    select: {
      id: true,
      url: true,
      altText: true,
      order: true,
    },
    orderBy: {
      order: 'asc' as const,
    },
  },
} satisfies Prisma.ProjectSelect;

// Definieer het type voor een volledig project
// Gebruik de namespace
export type FullProjectType = Prisma.ProjectGetPayload<{ select: typeof fullProjectSelect }>;

// Gebruik het nieuwe type
export async function getProjectBySlug(slug: string): Promise<FullProjectType | null> { // Update return type
  console.log(`Fetching project with slug: ${slug}`);
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      select: fullProjectSelect, // Gebruik de gedefinieerde selectie
    });
    return project;
  } catch (error) {
    console.error(`Failed to fetch project with slug ${slug}:`, error);
    return null; // Return null bij fout
  }
}

// Definieer de verwachte JWT payload structuur (kopieer van auth.ts of definieer hier)
interface JwtPayload {
  userId: string;
  role: string;
}

// Helper functie om de huidige sessie te valideren en de payload terug te geven
export async function validateAdminSession(): Promise<JwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    throw new Error('Unauthorized: No session token');
  }

  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is niet ingesteld!');
    throw new Error('Server configuration error');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    if (decoded.role !== 'ADMIN') {
      throw new Error('Unauthorized: Insufficient role');
    }
    return decoded; // Geef de gevalideerde payload terug
  } catch (error) {
    console.error('JWT Verification failed:', error);
    // Vang specifiek JWT errors af indien nodig (bv. TokenExpiredError)
    throw new Error('Unauthorized: Invalid or expired token'); 
  }
}

// --- SERVER ACTION: Delete Project --- 
export async function deleteProjectAction(projectId: string): Promise<{ success: boolean; message?: string }> {
  console.log(`Attempting to delete project with ID: ${projectId}`);
  
  try {
    // --- Autorisatie Check --- 
    const session = await validateAdminSession(); // Gebruik helper
    // Geen verdere check nodig, helper gooit error bij falen
    // --- Einde Autorisatie Check ---

    await prisma.project.delete({
      where: { id: projectId },
    });

    console.log(`Project ${projectId} succesvol verwijderd door user ${session.userId}.`);
    revalidatePath('/admin_area/projects');
    return { success: true, message: 'Project succesvol verwijderd.' };

  } catch (error: any) {
    console.error(`Fout bij verwijderen project ${projectId}:`, error);
    let errorMessage = 'Kon project niet verwijderen door een serverfout.';
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      errorMessage = 'Project niet gevonden om te verwijderen.';
    } else if (error.message?.startsWith('Unauthorized')) {
      // Pak de specifieke Unauthorized error boodschap
      errorMessage = error.message;
    } else if (error.message === 'Server configuration error') {
       errorMessage = 'Server configuratiefout. Kan actie niet uitvoeren.';
    }
    
    return { success: false, message: errorMessage };
  }
}

// --- Zod Schema voor Project Validatie --- 
const ProjectSchema = z.object({
  title: z.string().min(3, { message: 'Titel moet minimaal 3 tekens bevatten.' }),
  slug: z.string().min(3, { message: 'Slug moet minimaal 3 tekens bevatten.' })
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug mag alleen kleine letters, cijfers en koppeltekens bevatten.' }),
  shortDescription: z.string().optional(),
  detailedContent: z.string().min(10, { message: 'Gedetailleerde inhoud moet minimaal 10 tekens bevatten.'}),
  liveUrl: z.string().url({ message: 'Ongeldige URL voor live versie.' }).optional().or(z.literal('')), // Optioneel en sta lege string toe
  githubUrl: z.string().url({ message: 'Ongeldige URL voor GitHub.' }).optional().or(z.literal('')),
  technologies: z.preprocess((arg) => {
    // Converteer string (uit FormData) naar array, of geef bestaande array terug
    if (typeof arg === 'string') {
      return arg.split(',').map(item => item.trim()).filter(Boolean); // Split, trim, verwijder lege
    }
    return arg;
  }, z.array(z.string()).optional()), // Array van strings, optioneel
  category: z.string().optional(),
  isFeatured: z.preprocess((arg) => arg === 'on' || arg === true, z.boolean().default(false)), // Converteer checkbox waarde
  // order: z.coerce.number().optional(), // Nog niet geimplementeerd
  // metaTitle: z.string().optional(),
  // metaDescription: z.string().optional(),
  // images: ... // Afbeeldingen apart afhandelen
});

// Type voor de state van de create/update actions
export type ProjectFormState = {
  success: boolean;
  message?: string;
  errors?: {
    title?: string[];
    slug?: string[];
    shortDescription?: string[];
    detailedContent?: string[];
    liveUrl?: string[];
    githubUrl?: string[];
    technologies?: string[];
    category?: string[];
    images?: string[]; // Voeg errors voor images toe
    general?: string[];
  };
  // Veld om evt. aangemaakte/bijgewerkte slug terug te geven
  projectSlug?: string | null;
};

// Helper functie voor Cloudinary upload
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        fetch_format: 'auto', // Optimaliseer formaat
        quality: 'auto', // Optimaliseer kwaliteit
        // Optioneel: maximale breedte voor consistentie
        // width: 1200, 
        // crop: 'limit',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject('Cloudinary upload failed');
        } else if (result) {
          console.log('Cloudinary upload succesvol:', result.secure_url);
          resolve(result.secure_url);
        } else {
           reject('Cloudinary upload gaf geen resultaat of error');
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// --- SERVER ACTION: Create Project --- 
export async function createProjectAction(prevState: ProjectFormState | undefined, formData: FormData): Promise<ProjectFormState> {
  console.log('createProjectAction aangeroepen...');

  try {
    const session = await validateAdminSession();
    
    // 1. Valideer Tekstuele Velden
    const validatedFields = ProjectSchema.safeParse({
      title: formData.get('title'),
      slug: formData.get('slug'),
      shortDescription: formData.get('shortDescription'),
      detailedContent: formData.get('detailedContent'),
      liveUrl: formData.get('liveUrl'),
      githubUrl: formData.get('githubUrl'),
      technologies: formData.get('technologies'),
      category: formData.get('category'),
      isFeatured: formData.get('isFeatured'),
    });

    if (!validatedFields.success) {
      console.error('Project validatie gefaald:', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { title, slug, shortDescription, detailedContent, liveUrl, githubUrl, technologies, category, isFeatured } = validatedFields.data;

    // 2. Haal Afbeeldingen en Alt Teksten op & Valideer
    const imageFiles = formData.getAll('projectImages').filter(
      (entry): entry is File => 
        typeof entry === 'object' && 
        entry !== null && 
        typeof entry.size === 'number' && 
        entry.size > 0 && // Controleer of er daadwerkelijk inhoud is
        typeof entry.name === 'string' &&
        typeof entry.type === 'string' && // Type check voor validatie
        typeof entry.arrayBuffer === 'function' // Belangrijk voor upload
    ) as File[];
    const altTexts = formData.getAll('altTexts') as string[]; // Haal alt teksten op

    // --- Check: Aantal bestanden en alt teksten moeten overeenkomen --- 
    if (imageFiles.length !== altTexts.length) {
      console.error(`Mismatch: ${imageFiles.length} files vs ${altTexts.length} alt texts`);
      return {
        success: false,
        message: 'Interne fout: Aantal afbeeldingen en alt-teksten komen niet overeen.',
        errors: { images: ['Kon alt-teksten niet correct verwerken.'] },
      };
    }
    // --- Einde Check ---

    // --- Valideer Alt Teksten (bv. niet leeg) --- 
    let imageValidationErrors: string[] = [];
    for (let i = 0; i < altTexts.length; i++) {
      if (!altTexts[i] || altTexts[i].trim() === '') {
         imageValidationErrors.push(`Alt-tekst voor afbeelding ${i + 1} mag niet leeg zijn.`);
      }
    }
    // --- Einde Validatie ---

    // Valideer bestanden (grootte, type), voeg evt. alt text errors toe
    for (const file of imageFiles) {
      const maxFileSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxFileSize) {
        imageValidationErrors.push(`Bestand ${file.name} is te groot (max 5MB).`);
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        imageValidationErrors.push(`Bestandstype van ${file.name} (${file.type}) is niet toegestaan.`);
      }
    }

    if (imageValidationErrors.length > 0) {
      console.error('Afbeelding/Alt tekst validatie gefaald:', imageValidationErrors);
      return {
        success: false,
        message: 'Fouten bij valideren afbeeldingen of alt-teksten.',
        errors: { images: imageValidationErrors },
      };
    }

    let newProject: PrismaProject;
    const uploadedImageData: { url: string; order: number; altText: string }[] = [];

    // 3. Start Transactie
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 3a. Upload afbeeldingen naar Cloudinary
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const altText = altTexts[i]; // Krijg bijbehorende alt tekst
        const buffer = Buffer.from(await file.arrayBuffer());
        try {
          const imageUrl = await uploadToCloudinary(buffer, 'portfolio_projects');
          uploadedImageData.push({ url: imageUrl, order: i, altText: altText }); // Sla alt tekst op
        } catch (uploadError) {
          throw new Error(`Kon afbeelding ${file.name} niet uploaden.`); 
        }
      }

      // 3b. Maak het project aan
      newProject = await tx.project.create({
        data: {
          title,
          slug,
          shortDescription: shortDescription || null,
          detailedContent,
          liveUrl: liveUrl || null,
          githubUrl: githubUrl || null,
          technologies: technologies || [],
          category: category || null,
          isFeatured: isFeatured || false,
          // Images worden hieronder apart toegevoegd
        },
      });
      console.log(`Project aangemaakt in DB: ${newProject.title} (ID: ${newProject.id})`);

      // 3c. Maak ProjectImage records aan (met de juiste alt tekst)
      if (uploadedImageData.length > 0) {
        await tx.projectImage.createMany({
          data: uploadedImageData.map(img => ({
            url: img.url,
            altText: img.altText, // Gebruik de opgeslagen alt tekst
            order: img.order,
            projectId: newProject.id,
          })),
        });
        console.log(`${uploadedImageData.length} afbeeldingen gekoppeld aan project ${newProject.id}`);
      }
    });

    console.log(`Project succesvol aangemaakt door user ${session.userId}`);

  } catch (error: any) {
    console.error('Fout bij aanmaken project:', error);
    let errorMessage = error.message || 'Kon project niet aanmaken door een serverfout.';
    let specificErrors: ProjectFormState['errors'] = { general: [errorMessage] };

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
       if ((error.meta?.target as string[])?.includes('slug')) {
         errorMessage = 'Deze slug bestaat al. Kies een unieke slug.';
         specificErrors = { slug: [errorMessage] };
       }
    }
    else if (error.message?.startsWith('Unauthorized')) { 
      errorMessage = error.message; // Gebruik specifieke auth error
      specificErrors = { general: [errorMessage] }; 
    }
    else if (error.message === 'Server configuration error') {
       errorMessage = 'Server configuratiefout. Kan actie niet uitvoeren.';
       specificErrors = { general: [errorMessage] };
    }
    else if (errorMessage.startsWith('Kon afbeelding')) {
      specificErrors = { images: [errorMessage] };
    }
    else if (error instanceof z.ZodError) {
        errorMessage = 'Validatiefouten gevonden.';
        specificErrors = error.flatten().fieldErrors;
    }

    const finalErrors = { ...prevState?.errors, ...specificErrors };
    return { success: false, message: errorMessage, errors: finalErrors };
  }

  // 4. Revalidate en Redirect
  revalidatePath('/admin_area/projects');
  redirect('/admin_area/projects');
}

// --- SERVER ACTION: Update Project --- 
export async function updateProjectAction(prevState: ProjectFormState | undefined, formData: FormData): Promise<ProjectFormState> {
  console.log('updateProjectAction aangeroepen...');

  const projectId = formData.get('projectId') as string;
  if (!projectId) {
    return { success: false, message: 'Project ID ontbreekt.', errors: { general: ['Project ID ontbreekt.'] } };
  }

  try {
    const session = await validateAdminSession();
    
    // 1. Valideer Tekstuele Velden
    const validatedFields = ProjectSchema.safeParse({
      title: formData.get('title'),
      slug: formData.get('slug'),
      shortDescription: formData.get('shortDescription'),
      detailedContent: formData.get('detailedContent'),
      liveUrl: formData.get('liveUrl'),
      githubUrl: formData.get('githubUrl'),
      technologies: formData.get('technologies'), 
      category: formData.get('category'),
      isFeatured: formData.get('isFeatured'),
    });

    if (!validatedFields.success) {
      console.error('Project validatie gefaald (update):', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: validatedFields.error.flatten().fieldErrors,
        projectSlug: formData.get('slug') as string | null 
      };
    }

    const { title, slug, shortDescription, detailedContent, liveUrl, githubUrl, technologies, category, isFeatured } = validatedFields.data;
    console.log('Gevalideerde update data:', validatedFields.data);

    // 2. Haal NIEUWE Afbeeldingen en Alt Teksten op & Valideer
    const imageFiles = formData.getAll('projectImages').filter(
      (entry): entry is File => 
        typeof entry === 'object' && 
        entry !== null && 
        typeof entry.size === 'number' && 
        entry.size > 0 && // Controleer of er daadwerkelijk inhoud is
        typeof entry.name === 'string' &&
        typeof entry.type === 'string' && // Type check voor validatie
        typeof entry.arrayBuffer === 'function' // Belangrijk voor upload
    ) as File[];
    const altTexts = formData.getAll('altTexts') as string[];

    if (imageFiles.length !== altTexts.length) {
       return {
         success: false,
         message: 'Interne fout: Aantal afbeeldingen en alt-teksten komen niet overeen.',
         errors: { images: ['Kon alt-teksten niet correct verwerken.'] },
       };
    }

    let imageValidationErrors: string[] = [];
    for (let i = 0; i < altTexts.length; i++) {
       if (!altTexts[i] || altTexts[i].trim() === '') {
          imageValidationErrors.push(`Alt-tekst voor afbeelding ${i + 1} mag niet leeg zijn.`);
       }
    }
    for (const file of imageFiles) {
      const maxFileSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxFileSize) {
        imageValidationErrors.push(`Bestand ${file.name} is te groot (max 5MB).`);
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        imageValidationErrors.push(`Bestandstype van ${file.name} (${file.type}) is niet toegestaan.`);
      }
    }

    if (imageValidationErrors.length > 0) {
       return {
         success: false,
         message: 'Fouten bij valideren nieuwe afbeeldingen of alt-teksten.',
         errors: { images: imageValidationErrors },
       };
    }

    // 3. Update Project Tekstuele Data
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...validatedFields.data, // Gebruik alle gevalideerde data
      },
      // We hebben de bijgewerkte data nodig voor alt-tekst
      select: { id: true, title: true, slug: true }, 
    });
    console.log(`Project data succesvol bijgewerkt: ${updatedProject.title}`);

    // 4. Upload NIEUWE Afbeeldingen & Koppel ze (indien aanwezig)
    if (imageFiles.length > 0) {
      const uploadedImageData: { url: string; order: number; altText: string }[] = [];
      const existingImageCount = await prisma.projectImage.count({ where: { projectId } });
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const altText = altTexts[i]; // Krijg bijbehorende alt tekst
        const buffer = Buffer.from(await file.arrayBuffer());
        try {
          const imageUrl = await uploadToCloudinary(buffer, 'portfolio_projects');
          uploadedImageData.push({ url: imageUrl, order: existingImageCount + i, altText: altText });
        } catch (uploadError) {
          throw new Error(`Kon nieuwe afbeelding ${file.name} niet uploaden.`); 
        }
      }

      // Koppel nieuwe afbeeldingen
      await prisma.projectImage.createMany({
        data: uploadedImageData.map(img => ({
          url: img.url,
          altText: img.altText, // Gebruik de opgeslagen alt tekst
          order: img.order,
          projectId: updatedProject.id,
        })),
      });
      console.log(`${uploadedImageData.length} nieuwe afbeeldingen succesvol toegevoegd aan project ${projectId}`);
    }

    console.log(`Project ${projectId} succesvol bijgewerkt door user ${session.userId}`);

  } catch (error: any) {
    console.error(`Fout bij bijwerken project ${projectId}:`, error);
    let errorMessage = error.message || 'Kon project niet bijwerken door een serverfout.';
    let specificErrors: ProjectFormState['errors'] = { general: [errorMessage] };
    const currentSlug = formData.get('slug') as string | null;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('slug')) {
        errorMessage = 'Deze slug bestaat al. Kies een unieke slug.';
        specificErrors = { slug: [errorMessage] };
      } else if (error.code === 'P2025') {
        errorMessage = 'Te bewerken project niet gevonden.';
        specificErrors = { general: [errorMessage] };
      }
    }
    else if (error.message?.startsWith('Unauthorized')) { 
      errorMessage = error.message; // Gebruik specifieke auth error
      specificErrors = { general: [errorMessage] };
    }
    else if (error.message === 'Server configuration error') {
       errorMessage = 'Server configuratiefout. Kan actie niet uitvoeren.';
       specificErrors = { general: [errorMessage] };
    }
    else if (errorMessage.startsWith('Kon nieuwe afbeelding')) {
      specificErrors = { images: [errorMessage] };
    } 
    else if (error instanceof z.ZodError) {
        errorMessage = 'Validatiefouten gevonden.';
        specificErrors = error.flatten().fieldErrors;
    }

    const finalErrors = { ...prevState?.errors, ...specificErrors };
    return { success: false, message: errorMessage, errors: finalErrors, projectSlug: currentSlug };
  }

  // 5. Revalidate en Redirect
  const finalSlug = formData.get('slug') as string; // Gebruik de (mogelijk gewijzigde) slug
  revalidatePath('/admin_area/projects');
  revalidatePath(`/admin_area/projects/${finalSlug}`);
  revalidatePath(`/projects/${finalSlug}`);
  revalidatePath('/');

  redirect('/admin_area/projects');
}

// --- Fix Implicit Any for tx --- 
// Assuming tx is used inside prisma.$transaction
async function someTransactionalFunction() {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // use tx here
    // Voorbeeld: await tx.project.update(...)
  });
} 