import { sql } from './db';

export async function searchSuggestions(search: string): Promise<string[]> {
  if (!search || search.trim().length < 2) return []

  search = normalize(search)
  const words = search.trim().split(/\s+/).map(w => w.toLowerCase())
  const lastWord = words.pop()
  if (!lastWord) return []

  // construire le filtre pour les mots précédents
  const prevFilters = words.map(w => sql`title ILIKE ${'%' + w + '%'}`).reduce((prev, curr) => sql`${prev} AND ${curr}`, sql`true`)

  const result = await sql`
    SELECT DISTINCT word FROM (
      SELECT unnest(
        regexp_split_to_array(
          lower(regexp_replace(title, '[^a-zA-Z0-9À-ÿ]+', ' ', 'g')),
          '\\s+'
        )
      ) AS word
      FROM jobs
      WHERE ${prevFilters} AND title ILIKE ${'%' + lastWord + '%'}
      
      UNION ALL
      
      SELECT unnest(
        regexp_split_to_array(
          lower(regexp_replace(company, '[^a-zA-Z0-9À-ÿ]+', ' ', 'g')),
          '\\s+'
        )
      ) AS word
      FROM jobs
      WHERE ${prevFilters} AND company ILIKE ${'%' + lastWord + '%'}
    ) words
    WHERE word ILIKE ${lastWord + '%'}
    LIMIT 5
  `

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

  return result.map((row: any) => row.city);
}