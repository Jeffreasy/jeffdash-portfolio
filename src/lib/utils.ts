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

// Voeg hier meer utility functies toe... 