/**
 * Normaliser une chaîne de caractères en supprimant les accents et en convertissant en minuscules.
 * @param {string} input - La chaîne à normaliser.
 * @returns {string} La chaîne normalisée.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()                                    // Convertir en minuscules
    .trim()                                           // Supprimer les espaces en debut et fin
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[\])}[{(]/g, '')                        // Supprimer les caractères speciaux
}