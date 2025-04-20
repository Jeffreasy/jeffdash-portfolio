'use server';

import { z } from 'zod';
import { logger } from '@/lib/logger';

// Zod schema voor validatie
const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Naam is verplicht." }),
  email: z.string().email({ message: "Ongeldig emailadres." }),
  message: z.string().min(1, { message: "Bericht is verplicht." }),
});

export type ContactFormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success?: boolean;
};

// Server Action voor het verwerken van het contactformulier
export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  // Bij validatiefouten, retourneer de fouten
  if (!validatedFields.success) {
    logger.warn('Contact form validation failed', { errors: validatedFields.error.flatten().fieldErrors });
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validatiefout.',
      success: false,
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    // TODO: Implementeer daadwerkelijke verzendlogica (bijv. email sturen)
    console.log('--- Contact Form Submission ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('-----------------------------');
    logger.info('Contact form submitted successfully', { name, email });

    // Hier zou je bijvoorbeeld een email kunnen sturen met een library zoals Resend of Nodemailer

    return { message: 'Bericht succesvol verzonden!', success: true };
  } catch (error) {
    logger.error('Failed to process contact form', error);
    return { message: 'Er is iets misgegaan bij het verzenden.', success: false };
  }
} 