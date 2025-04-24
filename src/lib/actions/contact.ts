'use server';

import { z } from 'zod';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { validateAdminSession } from './auth';
import crypto from 'crypto';

// --- Types (Vereenvoudigd - TODO: Verbeteren) --- //
interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string; // Timestamp als string
}

// --- EXPORT type ---
export type ContactSubmissionType = ContactSubmission; // Gebruik de nieuwe interface

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
  // Correct type for errors
  errors?: Partial<Record<keyof z.infer<typeof ContactFormSchema>, string[]>> & { general?: string[] };
};

// Server Action voor het verwerken van het contactformulier
export async function submitContactForm(prevState: ContactFormState | undefined, formData: FormData): Promise<ContactFormState> {
  logger.info('Contact form submission initiated with Supabase');
  const supabase = await createClient();

  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    logger.warn('Contact form validation failed', { errors: validatedFields.error.flatten().fieldErrors });
    return {
      success: false,
      message: 'Validatiefouten gevonden.',
      // Gebruik Zod's error object direct
      errors: { ...validatedFields.error.flatten().fieldErrors },
    };
  }

  try {
    logger.info('Saving contact submission to Supabase database', { email: validatedFields.data.email });
    
    // Genereer een unieke ID voor de inzending
    const submissionId = crypto.randomUUID();

    // Insert data into Supabase, inclusief de gegenereerde ID
    const { error } = await supabase
      .from('ContactSubmission')
      .insert([
        {
          id: submissionId,
          name: validatedFields.data.name,
          email: validatedFields.data.email,
          message: validatedFields.data.message,
          // isRead en createdAt worden door DB defaults afgehandeld
        }
      ]);

    if (error) {
        logger.error('Supabase insert error ContactSubmission', { error });
        throw error; // Gooi error door naar catch block
    }

    logger.info('Contact submission successfully saved', { submissionId });

    // TODO: Stuur eventueel een e-mail notificatie

    return { success: true, message: 'Bedankt voor je bericht! Ik neem zo snel mogelijk contact op.' };

  } catch (error: any) {
    logger.error('Failed to save contact submission', { error: error.message || error });
    return {
      success: false,
      message: 'Er is een serverfout opgetreden bij het versturen van het formulier. Probeer het later opnieuw.',
      errors: { general: ['Serverfout.'] } // Voeg general error toe
    };
  }
}

// --- Actions voor Admin Area --- //

/**
 * Haalt alle contact inzendingen op voor de admin lijst.
 */
export async function getContactSubmissions(): Promise<ContactSubmissionType[]> {
  logger.info('Fetching all contact submissions for admin with Supabase');
  const supabase = await createClient();
  try {
    await validateAdminSession(); // Check admin rights
    logger.info('Admin session validated for getContactSubmissions');

    const { data, error } = await supabase
      .from('ContactSubmission')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    logger.info(`Fetched ${data?.length ?? 0} contact submissions`);
    return data || [];
  } catch (error: any) {
    logger.error('Failed to fetch contact submissions', { error: error.message || error });
    throw new Error(error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? error.message : 'Kon inzendingen niet ophalen.');
  }
}

/**
 * Wijzigt de 'isRead' status van een inzending.
 */
export async function toggleSubmissionReadStatus(submissionId: string): Promise<{ success: boolean; message?: string; newState?: boolean }> {
  logger.info('Toggling read status for submission with Supabase', { submissionId });
  const supabase = await createClient();
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for toggling read status', { userId: session.userId, submissionId });

    // Haal huidige status op
    const { data: currentSubmission, error: fetchError } = await supabase
      .from('ContactSubmission')
      .select('isRead')
      .eq('id', submissionId)
      .single();

    if (fetchError || !currentSubmission) {
       if (fetchError?.code === 'PGRST116') throw new Error('Inzending niet gevonden.');
       throw fetchError || new Error('Kon huidige status niet ophalen.');
    }

    const newReadState = !currentSubmission.isRead;

    // Update de status
    const { error: updateError } = await supabase
      .from('ContactSubmission')
      .update({ isRead: newReadState })
      .eq('id', submissionId);

    if (updateError) throw updateError;

    logger.info('Read status successfully toggled', { submissionId, newReadState, userId: session.userId });
    revalidatePath('/admin_area/contacts');
    return {
      success: true,
      message: `Status gewijzigd naar ${newReadState ? 'gelezen' : 'ongelezen'}.`,
      newState: newReadState
    };

  } catch (error: any) {
    logger.error('Failed to toggle read status', { submissionId, error: error.message || error });
    let errorMessage = 'Kon status niet wijzigen door een serverfout.';
    if (error.message === 'Inzending niet gevonden.') {
      errorMessage = error.message;
    } else if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}

/**
 * Verwijdert een contact inzending.
 */
export async function deleteContactSubmission(submissionId: string): Promise<{ success: boolean; message?: string }> {
  logger.info('Attempting to delete contact submission with Supabase', { submissionId });
  const supabase = await createClient();
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for delete submission action', { userId: session.userId, submissionId });

    const { error } = await supabase
      .from('ContactSubmission')
      .delete()
      .eq('id', submissionId);

    if (error) throw error;

    logger.info('Contact submission successfully deleted', { submissionId, userId: session.userId });
    revalidatePath('/admin_area/contacts');
    return { success: true, message: 'Inzending succesvol verwijderd.' };

  } catch (error: any) {
    logger.error('Failed to delete contact submission', { submissionId, error: error.message || error });
    let errorMessage = 'Kon inzending niet verwijderen door een serverfout.';
    if (error.code === 'PGRST116') { // Check for Supabase 'not found'
       errorMessage = 'Inzending niet gevonden om te verwijderen.';
    } else if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
} 