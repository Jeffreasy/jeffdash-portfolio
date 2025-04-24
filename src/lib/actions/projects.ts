'use server';

import { createClient } from '@/lib/supabase/server'; // Toegevoegd
import { revalidatePath } from 'next/cache';
// import { Prisma } from '@prisma/client'; // Verwijderd
// import type { Project } from '@prisma/client'; // Verwijderd
// export type PrismaProject = Project; // Verwijderd
import { z } from 'zod';
import { redirect } from 'next/navigation';
import cloudinary from '@/lib/cloudinary';
import streamifier from 'streamifier';
// import { cookies } from 'next/headers'; // Niet meer direct nodig hier?
// import jwt from 'jsonwebtoken'; // Verwijderd
import { validateAdminSession } from './auth'; // Importeer de Supabase-versie
import { logger } from '@/lib/logger'; // <-- VOEG DEZE IMPORT TOE

// --- Type Definities (Vereenvoudigd - TODO: Verbeteren met Supabase types/interfaces) ---

// Ga ervan uit dat tabelnamen overeenkomen met Prisma model namen: Project, ProjectImage
// Definieer basis types (pas aan op basis van daadwerkelijke tabelstructuur)
export interface ProjectImage {
  id: string;
  url: string;
  altText: string;
  order: number;
  projectId: string; // Foreign key
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  detailedContent: string;
  liveUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  category: string | null;
  isFeatured: boolean;
  order: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string; // Supabase geeft strings voor timestamps
  updatedAt: string;
  // Relatie: In Supabase halen we dit op via de query
  ProjectImage?: ProjectImage[]; // Hernoemd van 'images'
}

// Noot: De `select` queries hieronder bepalen welke velden daadwerkelijk aanwezig zijn.
// Deze interfaces zijn slechts een startpunt.

// Type voor Featured Projects (alleen de geselecteerde velden + afgeleide velden)
export type FeaturedProjectType = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  technologies: string[];
  // Afgeleide velden
  featuredImageUrl?: string;
  featuredImageAlt?: string;
};

// Type voor een volledig project (met alle afbeeldingen)
export type FullProjectType = Project & {
   ProjectImage?: ProjectImage[]; // Supabase haalt dit op als geneste array
};

// Type voor Project Preview (voor de lijstpagina)
// Inclusief afgeleide featured image velden
export type ProjectPreviewType = Pick<Project, 
  'id' | 'slug' | 'title' | 'shortDescription' | 'technologies' | 'category'
> & {
  featuredImageUrl?: string;
  featuredImageAlt?: string;
};

// Type voor admin lijst item (voeg eventueel meer velden toe die nodig zijn in de tabel)
export type AdminProjectListItemType = Pick<Project,
  'id' | 'slug' | 'title' | 'category' | 'isFeatured' | 'createdAt' | 'updatedAt' 
>; 

export async function getFeaturedProjects(): Promise<{
  featuredProjects: FeaturedProjectType[];
  totalProjectCount: number;
}> {
  console.log('Fetching featured projects with Supabase...');
  const supabase = await createClient();
  try {
    // Query voor featured projects, inclusief de eerste afbeelding
    const { data: projectsData, error: projectsError } = await supabase
      .from('Project')
      .select(`
        id,
        slug,
        title,
        shortDescription,
        technologies,
        ProjectImage ( url, altText )
      `) // Selecteer project velden en geneste afbeeldingen
      .eq('isFeatured', true)
      .order('createdAt', { ascending: false })
      .limit(3);
      // TODO: Order ProjectImage by 'order' field if needed, requires specific Supabase syntax

    if (projectsError) throw projectsError;

    // Define type for the data being mapped
    type ProjectDataForMap = {
      id: string;
      slug: string;
      title: string;
      shortDescription: string | null;
      technologies: string[];
      ProjectImage: { url: string; altText: string }[] | null;
    }

    // Transformeer data om te matchen met het verwachte type
    const featuredProjects: FeaturedProjectType[] = (projectsData || []).map((project: ProjectDataForMap) => ({
      ...project,
      featuredImageUrl: project.ProjectImage?.[0]?.url, // Haal URL van eerste afbeelding
      featuredImageAlt: project.ProjectImage?.[0]?.altText ?? project.title,
    }));

    // Aparte query voor het totale aantal projecten
    const { count, error: countError } = await supabase
      .from('Project')
      .select('*', { count: 'exact', head: true }); // Efficiënte manier om te tellen

    if (countError) throw countError;

    return {
      featuredProjects,
      totalProjectCount: count ?? 0,
    };
  } catch (error: any) {
    console.error("Failed to fetch featured projects:", error.message || error);
    return { featuredProjects: [], totalProjectCount: 0 };
  }
}

// Functie aangepast om ook eerste afbeelding op te halen
export async function getProjects(): Promise<ProjectPreviewType[]> { 
  console.log('Fetching projects with Supabase (including first image)...');
  const supabase = await createClient();
  try {
    // Query aangepast om eerste ProjectImage mee te nemen (gesorteerd op order)
    const { data: projectsData, error } = await supabase
      .from('Project')
      .select(`
        id,
        slug,
        title,
        shortDescription,
        technologies,
        category,
        ProjectImage ( url, altText )
      `)
      // Optioneel: order de projecten zelf ook (bv. op datum of custom 'order' veld)
      .order('createdAt', { ascending: false })
      // We halen hier GEEN .limit() op, we willen alle projecten
      // Order de afbeeldingen binnen de subquery en limiteer daar (impliciet door select?) 
      // Supabase haalt standaard gerelateerde records op, we moeten filteren/sorteren in de map
      // Laten we sorteren in de map voor nu.
      ;

    if (error) throw error;
    
    // Define type for the data being mapped (similar to featured projects)
    type ProjectListDataForMap = {
        id: string;
        slug: string;
        title: string;
        shortDescription: string | null;
        technologies: string[];
        category: string | null;
        ProjectImage: { url: string; altText: string }[] | null; // Kan een array zijn
    }

    // Transformeer data om te matchen met ProjectPreviewType
    const projects: ProjectPreviewType[] = (projectsData || []).map((project: ProjectListDataForMap) => {
        // Sorteer de afbeeldingen op volgorde (als ze bestaan) en pak de eerste
        const sortedImages = project.ProjectImage; // In V1_1 script wordt order niet gesorteerd in de query hier!
        // TODO: Als order belangrijk is, moet de query complexer of sorteer hier
        const firstImage = sortedImages?.[0]; 
        
        return {
          id: project.id,
          slug: project.slug,
          title: project.title,
          shortDescription: project.shortDescription,
          technologies: project.technologies,
          category: project.category,
          featuredImageUrl: firstImage?.url,
          featuredImageAlt: firstImage?.altText ?? project.title,
        };
    });

    return projects;

  } catch (error: any) {
    console.error("Failed to fetch projects:", error.message || error);
    return []; // Return lege array bij fout
  }
}


export async function getProjectBySlug(slug: string): Promise<FullProjectType | null> {
  console.log(`Fetching project with slug: ${slug} using Supabase...`);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('Project')
      .select(`
        *,
        ProjectImage ( * )
      `) // Haal alle project velden en alle gerelateerde afbeeldingen op
      .eq('slug', slug)
      .order('order', { referencedTable: 'ProjectImage', ascending: true }) // Sorteer afbeeldingen
      .single(); // Verwacht één resultaat of null

    if (error) {
      // Supabase gooit een error als er geen rij wordt gevonden met .single()
      // Check of het de specifieke 'not found' error is
      if (error.code === 'PGRST116') { // PostgREST code for 'Not found'
         console.log(`Project with slug ${slug} not found.`);
         return null;
      }
      // Anders is het een andere error
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(`Failed to fetch project with slug ${slug}:`, error.message || error);
    return null; // Return null bij fout
  }
}


// --- SERVER ACTION: Delete Project ---
export async function deleteProjectAction(projectId: string): Promise<{ success: boolean; message?: string }> {
  console.log(`Attempting to delete project with ID: ${projectId} using Supabase...`);
  const supabase = await createClient();

  try {
    // --- Autorisatie Check ---
    const session = await validateAdminSession(); // Gebruik de Supabase-versie uit auth.ts
    console.log(`User ${session.userId} (role: ${session.role}) authorized to delete.`);
    // --- Einde Autorisatie Check ---

    // Verwijder het project
    // Noot: Als RLS is ingesteld, moet de gebruiker permissie hebben om te verwijderen.
    // Als je de service_role client nodig hebt, moet de creatie van de client hier aangepast worden.
    const { error } = await supabase
      .from('Project')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    console.log(`Project ${projectId} succesvol verwijderd door user ${session.userId}.`);
    revalidatePath('/admin_area/projects');
    revalidatePath('/'); // Ook homepage revalideren (voor featured projects)
    return { success: true, message: 'Project succesvol verwijderd.' };

  } catch (error: any) {
    console.error(`Fout bij verwijderen project ${projectId}:`, error.message || error);
    let errorMessage = 'Kon project niet verwijderen door een serverfout.';
    // TODO: Verbeter Supabase error afhandeling indien nodig
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
         errorMessage = error.message; // Geef auth error door
    } else if (error.code === 'PGRST116' || error.details?.includes('Results contain 0 rows')) { // Check voor 'not found'
         errorMessage = 'Project niet gevonden om te verwijderen.';
    }
    return { success: false, message: errorMessage };
  }
}

// --- Zod Schema voor Project Validatie (blijft grotendeels hetzelfde) ---
const ProjectSchema = z.object({
  title: z.string().min(3, { message: 'Titel moet minimaal 3 tekens bevatten.' }),
  slug: z.string().min(3, { message: 'Slug moet minimaal 3 tekens bevatten.' })
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug mag alleen kleine letters, cijfers en koppeltekens bevatten.' }),
  shortDescription: z.string().optional().nullable(), // Sta null toe voor Supabase
  detailedContent: z.string().min(10, { message: 'Gedetailleerde inhoud moet minimaal 10 tekens bevatten.'}),
  liveUrl: z.string().url({ message: 'Ongeldige URL voor live versie.' }).optional().or(z.literal('')).nullable(), // Sta null toe
  githubUrl: z.string().url({ message: 'Ongeldige URL voor GitHub.' }).optional().or(z.literal('')).nullable(), // Sta null toe
  technologies: z.preprocess((arg) => {
    if (typeof arg === 'string') {
      return arg.split(',').map(item => item.trim()).filter(Boolean);
    }
    return arg;
  }, z.array(z.string()).optional()),
  category: z.string().optional().nullable(), // Sta null toe
  isFeatured: z.preprocess((arg) => arg === 'on' || arg === true, z.boolean().default(false)),
  metaTitle: z.string().optional().nullable(), // Sta null toe
  metaDescription: z.string().optional().nullable(), // Sta null toe
  // order: z.coerce.number().optional().nullable(), // Nog niet geimplementeerd
  // 'id' en 'images' worden niet direct gevalideerd uit het formulier
});

// Type voor de state van de create/update actions (blijft hetzelfde)
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
    images?: string[];
    general?: string[];
  };
  projectSlug?: string | null;
};

// Helper functie voor Cloudinary upload (blijft hetzelfde)
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Afbeelding uploaden mislukt.'));
        } else if (!result) {
          reject(new Error('Afbeelding uploaden mislukt, geen resultaat ontvangen.'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// --- SERVER ACTION: Create Project ---
export async function createProjectAction(prevState: ProjectFormState | undefined, formData: FormData): Promise<ProjectFormState> {
  console.log('Create project action gestart met Supabase...');
  const supabase = await createClient();

  try {
    // --- Autorisatie Check ---
    const session = await validateAdminSession();
    console.log(`User ${session.userId} (role: ${session.role}) authorized to create.`);
    // --- Einde Autorisatie Check ---

    // --- Afbeeldingen Verwerken (Cloudinary) ---
    const imageFiles = formData.getAll('images') as File[];
    const uploadedImageUrls: { url: string; altText: string; order: number }[] = [];

    // Valideer en upload afbeeldingen EERST
    for (let i = 0; i < imageFiles.length; i++) {
       const file = imageFiles[i];
       // Check of er een bestand is geselecteerd (grootte > 0)
       if (file && file.size > 0) {
         if (file.size > 5 * 1024 * 1024) { // Max 5MB check
             throw new Error(`Afbeelding "${file.name}" is te groot (max 5MB).`);
         }
         if (!file.type.startsWith('image/')) {
           throw new Error(`Bestand "${file.name}" is geen geldige afbeelding.`);
         }

         const buffer = Buffer.from(await file.arrayBuffer());
         const imageUrl = await uploadToCloudinary(buffer, 'portfolio_projects');
         // Gebruik bestandsnaam als standaard alt-tekst (kan verbeterd worden)
         uploadedImageUrls.push({ url: imageUrl, altText: file.name, order: i });
       }
    }

    // --- Formulier Data Valideren (Zod) ---
    // Kopieer FormData om 'images' te kunnen verwijderen voor Zod validatie
    const formDataCopy = new FormData();
    for (const [key, value] of formData.entries()) {
       if (key !== 'images') {
         formDataCopy.append(key, value);
       }
    }
    const validatedFields = ProjectSchema.safeParse(Object.fromEntries(formDataCopy));

    if (!validatedFields.success) {
      console.error('Validatiefout:', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        message: 'Validatiefout bij aanmaken project.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Zorg dat optionele velden die leeg zijn als null worden doorgegeven
    const projectDataToInsert = {
      ...validatedFields.data,
      liveUrl: validatedFields.data.liveUrl || null,
      githubUrl: validatedFields.data.githubUrl || null,
      shortDescription: validatedFields.data.shortDescription || null,
      category: validatedFields.data.category || null,
      metaTitle: validatedFields.data.metaTitle || null,
      metaDescription: validatedFields.data.metaDescription || null,
      technologies: validatedFields.data.technologies || [], // Zorg dat het een array is
    };

    // --- Database Insert (Supabase) ---
    console.log('Poging tot insert Project in Supabase...');
    const { data: newProject, error: insertError } = await supabase
      .from('Project')
      .insert(projectDataToInsert)
      .select('id, slug') // Vraag ID en slug terug van het nieuwe project
      .single();

    if (insertError || !newProject) {
      console.error('Supabase insert error Project:', insertError);
      // Check specifiek voor unique constraint violation op slug
      if (insertError?.code === '23505' && insertError?.message.includes('Project_slug_key')) {
         return {
           success: false,
           message: 'De opgegeven slug bestaat al. Kies een unieke slug.',
           errors: { slug: ['Deze slug is al in gebruik.'] }
         };
      }
      throw insertError || new Error('Kon project niet aanmaken in database.');
    }

    console.log('Project succesvol aangemaakt:', newProject);
    const newProjectId = newProject.id;
    const newProjectSlug = newProject.slug;

    // --- Afbeeldingen Koppelen (Insert in ProjectImage) ---
    if (uploadedImageUrls.length > 0) {
      console.log(`Poging tot insert ${uploadedImageUrls.length} afbeeldingen voor project ID ${newProjectId}...`);
      const imageInserts = uploadedImageUrls.map(img => ({
        ...img,
        projectId: newProjectId, // Koppel aan het net aangemaakte project
      }));

      const { error: imageInsertError } = await supabase
        .from('ProjectImage')
        .insert(imageInserts);

      if (imageInsertError) {
        // Belangrijk: Wat doen we hier? Project is aangemaakt, maar afbeeldingen niet.
        // Optie 1: Proberen project te verwijderen (rollback).
        // Optie 2: Fout loggen en gebruiker informeren dat afbeeldingen niet gelukt zijn.
        // Voor nu: loggen en fout teruggeven.
        console.error(`Kon afbeeldingen niet koppelen aan project ${newProjectId}:`, imageInsertError);
        // Geen 'throw' hier, geef state terug
         return {
           success: false, // Markeer als niet volledig succesvol
           message: `Project aangemaakt, maar kon afbeeldingen niet opslaan: ${imageInsertError.message}`,
           errors: { images: ['Kon afbeeldingen niet opslaan.'] },
           projectSlug: newProjectSlug, // Geef slug wel terug voor redirect
         };
      }
      console.log('Afbeeldingen succesvol gekoppeld.');
    }

    // --- Afronden ---
    revalidatePath('/admin_area/projects');
    revalidatePath('/projects'); // Publieke lijst
    revalidatePath('/'); // Homepage (featured)
    // We redirecten niet direct vanuit de action, maar geven succes state terug.
    // De client-side component kan dan redirecten op basis van de state.
    return {
      success: true,
      message: 'Project succesvol aangemaakt!',
      projectSlug: newProjectSlug, // Geef slug terug voor redirect
    };

  } catch (error: any) {
    console.error('Fout bij aanmaken project:', error.message || error);
    return {
      success: false,
      message: error.message || 'Kon project niet aanmaken door een serverfout.',
      errors: { general: [error.message || 'Serverfout.'] },
    };
  }
}


// --- SERVER ACTION: Update Project ---
export async function updateProjectAction(prevState: ProjectFormState | undefined, formData: FormData): Promise<ProjectFormState> {
  console.log('Update project action gestart met Supabase...');
  const supabase = await createClient();
  const projectId = formData.get('projectId') as string; // Haal projectId uit het formulier

  if (!projectId) {
    return { success: false, message: 'Project ID ontbreekt.', errors: { general: ['Project ID niet gevonden.'] } };
  }

  try {
    // --- Autorisatie Check ---
    const session = await validateAdminSession();
    console.log(`User ${session.userId} authorized to update project ${projectId}.`);
    // --- Einde Autorisatie Check ---

    // --- Afbeeldingen Verwerken ---
    // 1. Identificeer bestaande afbeeldingen om te verwijderen (obv formData?)
    //    Dit vereist dat het formulier IDs of URLs van te verwijderen afbeeldingen meestuurt.
    //    Voorbeeld: formData.getAll('imagesToDelete') -> array van image IDs
    const imagesToDeleteIds = formData.getAll('imagesToDelete') as string[];
    if (imagesToDeleteIds.length > 0) {
       console.log('Verwijderen van afbeeldingen met IDs:', imagesToDeleteIds);
       // TODO: Roep Cloudinary API aan om afbeeldingen te verwijderen (optioneel)
       // Verwijder records uit ProjectImage tabel
       const { error: deleteImagesError } = await supabase
         .from('ProjectImage')
         .delete()
         .in('id', imagesToDeleteIds);
       if (deleteImagesError) {
           console.error('Fout bij verwijderen afbeeldingen:', deleteImagesError);
           // Niet fataal, ga door maar log de fout
       }
    }

    // 2. Upload nieuwe afbeeldingen (zelfde logica als create)
    const imageFiles = formData.getAll('newImages') as File[]; // Gebruik andere naam bv 'newImages'
    const uploadedImageUrls: { url: string; altText: string; order: number }[] = [];
    // TODO: Bepaal juiste 'order' voor nieuwe afbeeldingen (bv. laatste + 1)
    let currentMaxOrder = 0; // Haal dit op uit bestaande images indien nodig
    // ... (haal max order op met aparte query) ...
    const { data: existingImages, error: orderError } = await supabase
       .from('ProjectImage')
       .select('order')
       .eq('projectId', projectId)
       .order('order', {ascending: false})
       .limit(1);

    if (existingImages && existingImages.length > 0) {
       currentMaxOrder = existingImages[0].order;
    }


    for (let i = 0; i < imageFiles.length; i++) {
       const file = imageFiles[i];
       if (file && file.size > 0) {
         // ... (validatie zoals in create) ...
         if (file.size > 5 * 1024 * 1024) throw new Error(`Afbeelding "${file.name}" is te groot (max 5MB).`);
         if (!file.type.startsWith('image/')) throw new Error(`Bestand "${file.name}" is geen geldige afbeelding.`);

         const buffer = Buffer.from(await file.arrayBuffer());
         const imageUrl = await uploadToCloudinary(buffer, 'portfolio_projects');
         uploadedImageUrls.push({ url: imageUrl, altText: file.name, order: currentMaxOrder + 1 + i });
       }
    }

    // --- Formulier Data Valideren ---
    const formDataCopy = new FormData();
     for (const [key, value] of formData.entries()) {
       // Verwijder image-gerelateerde velden voor validatie
       if (key !== 'imagesToDelete' && key !== 'newImages' && key !== 'projectId') {
         formDataCopy.append(key, value);
       }
    }
    const validatedFields = ProjectSchema.safeParse(Object.fromEntries(formDataCopy));

    if (!validatedFields.success) {
      console.error('Validatiefout:', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        message: 'Validatiefout bij bijwerken project.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

     const projectDataToUpdate = {
      ...validatedFields.data,
      liveUrl: validatedFields.data.liveUrl || null,
      githubUrl: validatedFields.data.githubUrl || null,
      shortDescription: validatedFields.data.shortDescription || null,
      category: validatedFields.data.category || null,
      metaTitle: validatedFields.data.metaTitle || null,
      metaDescription: validatedFields.data.metaDescription || null,
      technologies: validatedFields.data.technologies || [],
      updatedAt: new Date().toISOString(), // Update de timestamp
    };

    // --- Database Update (Project) ---
    console.log(`Poging tot update Project ${projectId} in Supabase...`);
    const { data: updatedProject, error: updateError } = await supabase
      .from('Project')
      .update(projectDataToUpdate)
      .eq('id', projectId)
      .select('slug') // Vraag slug terug
      .single();

    if (updateError || !updatedProject) {
        console.error('Supabase update error Project:', updateError);
        // Check specifiek voor unique constraint violation op slug (als slug is gewijzigd)
        if (updateError?.code === '23505' && updateError?.message.includes('Project_slug_key')) {
            return {
                success: false,
                message: 'De opgegeven slug bestaat al. Kies een unieke slug.',
                errors: { slug: ['Deze slug is al in gebruik.'] }
            };
        }
        // Check voor not found
        if (updateError?.code === 'PGRST116' || updateError?.details?.includes('Results contain 0 rows')) {
             return { success: false, message: 'Project niet gevonden om bij te werken.', errors: { general: ['Project niet gevonden.'] } };
        }
        throw updateError || new Error('Kon project niet bijwerken in database.');
    }

    const updatedProjectSlug = updatedProject.slug; // Slug voor redirect

    // --- Nieuwe Afbeeldingen Toevoegen (Insert in ProjectImage) ---
    if (uploadedImageUrls.length > 0) {
      console.log(`Poging tot insert ${uploadedImageUrls.length} nieuwe afbeeldingen voor project ID ${projectId}...`);
      const imageInserts = uploadedImageUrls.map(img => ({
        ...img,
        projectId: projectId,
      }));

      const { error: imageInsertError } = await supabase
        .from('ProjectImage')
        .insert(imageInserts);

      if (imageInsertError) {
        // Loggen en doorgaan, maar geef melding terug
        console.error(`Kon nieuwe afbeeldingen niet koppelen aan project ${projectId}:`, imageInsertError);
         return {
           success: false, // Markeer als niet volledig succesvol
           message: `Project bijgewerkt, maar kon nieuwe afbeeldingen niet opslaan: ${imageInsertError.message}`,
           errors: { images: ['Kon nieuwe afbeeldingen niet opslaan.'] },
           projectSlug: updatedProjectSlug,
         };
      }
       console.log('Nieuwe afbeeldingen succesvol gekoppeld.');
    }

     // --- Afronden ---
    revalidatePath('/admin_area/projects');
    revalidatePath(`/admin_area/projects/${updatedProjectSlug}`); // Detailpagina
    revalidatePath('/projects');
    revalidatePath(`/projects/${updatedProjectSlug}`);
    revalidatePath('/');
    return {
      success: true,
      message: 'Project succesvol bijgewerkt!',
      projectSlug: updatedProjectSlug,
    };

  } catch (error: any) {
     console.error(`Fout bij bijwerken project ${projectId}:`, error.message || error);
    return {
      success: false,
      message: error.message || 'Kon project niet bijwerken door een serverfout.',
      errors: { general: [error.message || 'Serverfout.'] },
    };
  }
}

/**
 * Haalt ALLE projecten op voor de admin lijst, inclusief specifieke admin-velden.
 */
export async function getProjectsForAdmin(): Promise<AdminProjectListItemType[]> {
  logger.info('Fetching all projects for admin list with Supabase');
  const supabase = await createClient();
  try {
    // Autorisatie check binnen de action
    await validateAdminSession(); 
    
    const { data, error } = await supabase
      .from('Project') // Tabelnaam 'Project'
      .select('id, slug, title, category, isFeatured, createdAt, updatedAt') // Selecteer benodigde velden voor admin tabel
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    logger.error('Failed to fetch projects for admin', { error: error.message || error });
    // Gooi de error door of geef lege array terug afhankelijk van hoe de pagina dit moet afhandelen
    // Voor nu: gooi door, zodat de pagina een error kan tonen
    // throw new Error('Kon projecten voor admin niet ophalen.'); 
    return []; // Of geef lege array terug
  }
}

// Voorbeeld van een transactionele functie (Niet direct toepasbaar met Supabase client JS, vereist DB functie/RPC)
// async function someTransactionalFunction() {
//   const supabase = createClient(); // Gebruik mogelijk service role client hier
//   // Supabase JS client ondersteunt geen directe transacties zoals Prisma $transaction.
//   // Voor atomische operaties over meerdere tabellen:
//   // 1. Maak een Database Functie (plpgsql) in Supabase die de logica bevat.
//   // 2. Roep deze functie aan met supabase.rpc('jouw_functie_naam', { args }).
//   console.warn('Transacties zoals Prisma.$transaction zijn niet direct mogelijk met supabase-js. Overweeg Database Functies (RPC).');
// } 