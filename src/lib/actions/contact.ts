'use server';

import { z } from 'zod';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma, ContactSubmission as PrismaContactSubmission } from '@prisma/client';
import { validateAdminSession } from './projects'; // Importeer validatie helper

// --- Types --- //

// --- EXPORT type --- 
// Type voor een enkele contact inzending (alle velden)
export type ContactSubmissionType = PrismaContactSubmission;

// Zod schema voor het valideren van het formulier (Frontend)
const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Naam moet minimaal 2 tekens bevatten.' }),
  email: z.string().email({ message: 'Voer een geldig e-mailadres in.' }),
  message: z.string().min(10, { message: 'Bericht moet minimaal 10 tekens bevatten.' }),
});

// Type voor de state van de submit actie
export type ContactFormState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof ContactFormSchema>, string[]>>;
};

// Server Action voor het verwerken van het contactformulier
export async function submitContactForm(prevState: ContactFormState | undefined, formData: FormData): Promise<ContactFormState> {
  logger.info('Contact form submission initiated');

  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    logger.warn('Contact form validation failed', { errors: validatedFields.error.flatten().fieldErrors });
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'Validatiefouten gevonden.',
      errors: { ...fieldErrors },
    };
  }

  try {
    logger.info('Saving contact submission to database', { email: validatedFields.data.email });
    await prisma.contactSubmission.create({
      data: validatedFields.data,
    });
    logger.info('Contact submission successfully saved');

    // TODO: Stuur eventueel een e-mail notificatie

    return { success: true, message: 'Bedankt voor je bericht! Ik neem zo snel mogelijk contact op.' };

  } catch (error) {
    logger.error('Failed to save contact submission', { error });
    return {
      success: false,
      message: 'Er is een serverfout opgetreden bij het versturen van het formulier. Probeer het later opnieuw.',
    };
  }
}

// --- Actions voor Admin Area --- //

/**
 * Haalt alle contact inzendingen op voor de admin lijst.
 */
export async function getContactSubmissions(): Promise<PrismaContactSubmission[]> {
  logger.info('Fetching all contact submissions for admin');
  try {
    await validateAdminSession(); // Check admin rights
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    logger.info(`Fetched ${submissions.length} contact submissions`);
    return submissions;
  } catch (error: any) {
    logger.error('Failed to fetch contact submissions', { error: error.message });
    // Gooi de error door zodat de aanroepende pagina weet dat er iets mis is
    // of return een lege array afhankelijk van de gewenste error handling.
    // Hier gooien we hem door zodat de pagina een fout kan tonen.
    throw new Error(error.message?.startsWith('Unauthorized') ? error.message : 'Kon inzendingen niet ophalen.');
  }
}

/**
 * Wijzigt de 'isRead' status van een inzending.
 */
export async function toggleSubmissionReadStatus(submissionId: string): Promise<{ success: boolean; message?: string; newState?: boolean }> {
  logger.info('Toggling read status for submission', { submissionId });
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for toggling read status', { userId: session.userId, submissionId });

    const submission = await prisma.contactSubmission.findUnique({
      where: { id: submissionId },
      select: { isRead: true },
    });

    if (!submission) {
      throw new Error('Inzending niet gevonden.');
    }

    const newReadState = !submission.isRead;

    await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: { isRead: newReadState },
    });

    logger.info('Read status successfully toggled', { submissionId, newReadState, userId: session.userId });
    revalidatePath('/admin_area/contacts');
    return { 
      success: true, 
      message: `Status gewijzigd naar ${newReadState ? 'gelezen' : 'ongelezen'}.`,
      newState: newReadState
    };

  } catch (error: any) {
    logger.error('Failed to toggle read status', { submissionId, error: error.message });
    let errorMessage = 'Kon status niet wijzigen door een serverfout.';
    if (error.message === 'Inzending niet gevonden.') {
      errorMessage = error.message;
    } else if (error.message?.startsWith('Unauthorized')) {
      errorMessage = error.message;
    } else if (error.message === 'Server configuration error') {
       errorMessage = 'Server configuratiefout.';
    }
    return { success: false, message: errorMessage };
  }
}

/**
 * Verwijdert een contact inzending.
 */
export async function deleteContactSubmission(submissionId: string): Promise<{ success: boolean; message?: string }> {
  logger.info('Attempting to delete contact submission', { submissionId });
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for delete submission action', { userId: session.userId, submissionId });

    await prisma.contactSubmission.delete({
      where: { id: submissionId },
    });

    logger.info('Contact submission successfully deleted', { submissionId, userId: session.userId });
    revalidatePath('/admin_area/contacts');
    return { success: true, message: 'Inzending succesvol verwijderd.' };

  } catch (error: any) {
    logger.error('Failed to delete contact submission', { submissionId, error: error.message });
    let errorMessage = 'Kon inzending niet verwijderen door een serverfout.';
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      errorMessage = 'Inzending niet gevonden om te verwijderen.';
    } else if (error.message?.startsWith('Unauthorized')) {
      errorMessage = error.message;
    } else if (error.message === 'Server configuration error') {
       errorMessage = 'Server configuratiefout.';
    }
    return { success: false, message: errorMessage };
  }
} 