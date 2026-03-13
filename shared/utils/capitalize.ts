/**
 * Met en majuscule le premier caractère d'une chaîne.
 * Si la chaîne est vide, retourne une chaîne vide.
 * @param {string} input - La chaîne à mettre en majuscule.
 * @returns {string} La chaîne avec le premier caractère en majuscule.
 */
export function capitalize(input: string): string {
  return input[0] ? input[0].toUpperCase() + input.slice(1) : ''
}