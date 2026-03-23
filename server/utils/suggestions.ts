import { sql } from './db';

export async function searchSuggestions(search: string): Promise<string[]> {
  if (!search || search.trim().length < 2) return []

  // Normaliser la recherche
  search = normalize(search)
  console.log(search)

  // Diviser la recherche en mots
  const words = search.trim().split(/\s+/).map(w => w.toLowerCase())
  const lastWord = words.pop()
  if (!lastWord) return []

  // Construire le filtre pour les mots précédents en utilisant `search_vector`
  const prevFilters = words
    .map(w => sql`search_vector @@ to_tsquery('french', ${w})`)
    .reduce((prev, curr) => sql`${prev} AND ${curr}`, sql`true`)

  // Requête SQL pour récupérer les suggestions basées sur le dernier mot
  const result = await sql`
    SELECT DISTINCT word FROM (
      SELECT unnest(
        regexp_split_to_array(
          lower(regexp_replace(title, '[^a-zA-Z0-9À-ÿ]+', ' ', 'g')),
          '\\s+'
        )
      ) AS word
      FROM jobs
      WHERE ${prevFilters} AND search_vector @@ to_tsquery('french', ${lastWord} || ':*')

      UNION ALL
      
      SELECT unnest(
        regexp_split_to_array(
          lower(regexp_replace(company, '[^a-zA-Z0-9À-ÿ]+', ' ', 'g')),
          '\\s+'
        )
      ) AS word
      FROM jobs
      WHERE ${prevFilters} AND search_vector @@ to_tsquery('french', ${lastWord} || ':*')
    ) words
    WHERE word ILIKE ${lastWord + '%'}
    LIMIT 5;
  `

  if (checkIfQuerySameAsResult(search, result, "word")) return []
  return result.map((row: any) => row.word)
}

export async function locationSuggestions(location: string): Promise<string[]> {
  if (!location || location.trim().length < 1) return [];
  location = normalize(location);

  const result = await sql`
    SELECT DISTINCT city
    FROM (
      SELECT
        CASE
          WHEN COUNT(*) FILTER (WHERE word LIKE '%-%') > 0 THEN MIN(TRIM(word))  -- garder le tiret si présent
          ELSE MIN(TRIM(word))
        END AS city,
        unaccent(lower(TRIM(word))) AS norm
      FROM (
        SELECT unnest(string_to_array(location, ',')) AS word
        FROM jobs
      ) locs
      GROUP BY unaccent(lower(TRIM(word)))
    ) cities
    WHERE norm LIKE unaccent(${location.toLowerCase()}) || '%'
    ORDER BY city
    LIMIT 5
  `;

  if (checkIfQuerySameAsResult(location, result, "city")) return []
  return result.map((row: any) => row.city);
}

/*******************************************************************************************************************************/

/**
 * Vérifie si la requête est identique au résultat de recherche.
 * La vérification est faite en comparant la requête avec le premier élément du résultat.
 * Si le résultat est vide, si la requête est différente du premier élément ou si le resultat contient plus d'un élément, la fonction retourne false.
 * Sinon, la fonction retourne true.
 * @param {string} query - La requête à vérifier.
 * @param {Record<string, any>[]} result - Le résultat de recherche.
 * @param {string} [elemName='word'] - Le nom de l'élément à vérifier dans le résultat.
 * @return {boolean} true si la requête est identique au résultat, false sinon.
 */
function checkIfQuerySameAsResult(query: string, result: Record<string, any>[], elemName: string = 'word'): boolean {
  return result.length === 1 && query.toLowerCase() === result[0]![elemName].toLowerCase();
}