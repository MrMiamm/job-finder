/**
 * Normaliser une chaîne de caractères en supprimant les accents et en convertissant en minuscules.
 * @param {string} input - La chaîne à normaliser.
 * @returns {string} La chaîne normalisée.
 */
export function normalize(input: string): string {
  return input.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}