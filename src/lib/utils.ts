// Placeholder voor algemene utility functies

/**
 * Formatteert een datum naar een leesbaar formaat (bv. 15 juli 2024).
 * @param dateInput De datum als Date object, string of nummer.
 * @returns Geformatteerde datum string of lege string bij ongeldige input.
 */
export function formatDate(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) {
    return '';
  }

  try {
    const date = new Date(dateInput);
    // Controleer of de datum geldig is na conversie
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('nl-NL', { // Gebruik Nederlandse locale
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return ''; // Return lege string bij onverwachte fouten
  }
}

/**
 * Genereert een slug van een string.
 * @param str De string om te converteren naar een slug.
 * @returns Een URL-vriendelijke slug.
 */
export function generateSlug(str: string): string {
  try {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Verwijder speciale tekens
      .replace(/[\s_-]+/g, '-') // Vervang spaties en underscores door koppeltekens
      .replace(/^-+|-+$/g, ''); // Verwijder koppeltekens aan begin en eind
  } catch (error) {
    console.error("Error generating slug:", error);
    return str.toLowerCase().replace(/\s+/g, '-'); // Fallback naar simpele conversie
  }
}

/**
 * Valideert een e-mailadres.
 * @param email Het e-mailadres om te valideren.
 * @returns Boolean indicerend of het e-mailadres geldig is.
 */
export function isValidEmail(email: string): boolean {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } catch (error) {
    console.error("Error validating email:", error);
    return false;
  }
}

/**
 * Truncateert een string naar een bepaalde lengte.
 * @param str De string om te truncaten.
 * @param length De maximale lengte.
 * @param suffix Het suffix om toe te voegen (default: '...').
 * @returns De getruncateerde string.
 */
export function truncateString(str: string, length: number, suffix: string = '...'): string {
  try {
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  } catch (error) {
    console.error("Error truncating string:", error);
    return str;
  }
}

/**
 * Maakt een object onveranderlijk (immutable).
 * @param obj Het object om onveranderlijk te maken.
 * @returns Een onveranderlijke versie van het object.
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  try {
    Object.keys(obj).forEach(prop => {
      if (typeof obj[prop as keyof T] === 'object' && obj[prop as keyof T] !== null) {
        deepFreeze(obj[prop as keyof T] as object);
      }
    });
    return Object.freeze(obj);
  } catch (error) {
    console.error("Error freezing object:", error);
    return obj;
  }
}

/**
 * Debounce functie voor het beperken van frequentie van functie aanroepen.
 * @param func De functie om te debouncen.
 * @param wait De wachttijd in milliseconden.
 * @returns Een gedebounced versie van de functie.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Voeg hier meer utility functies toe... 