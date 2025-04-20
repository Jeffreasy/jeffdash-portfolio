// Placeholder voor algemene utility functies

export function formatDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Voeg hier meer utility functies toe... 