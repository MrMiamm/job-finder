import { ApiSearchResult, TypeJob } from '#shared/types';
import { sql } from './db';

interface TypeJobDB {
  id: number;
  uuid: string;
  url: string;
  title: string;
  company: string;
  location: string;
  contract: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
  search_vector: string;
  days_since_posted: number;
}

export async function searchJobs(
  search: string,
  contracts: string[] | null,
  location: string | null,
  limit: number = 20,
  page: number = 1
): Promise<ApiSearchResult> {
  search = normalize(search);

  const conditions: any[] = [];

  // full-text search
  if (search !== 'all') {
    conditions.push(sql`search_vector @@ plainto_tsquery('french', unaccent(lower(${search})))`);
  }

  // contracts filter
  if (contracts?.length) {
    conditions.push(sql`contract = ANY(${contracts})`);
  }

  // location filter
  if (location) {
    conditions.push(sql`location = ${capitalize(location)}`);
  }

  // construction WHERE clause
  let whereClause = sql``;
  if (conditions.length > 0) {
    const combined = conditions.map((c) => c).reduce((prev, curr) => sql`${prev} AND ${curr}`);
    whereClause = sql`WHERE ${combined}`;
  }

  const offset = (page - 1) * limit;

  try {
    // Récupérer les jobs
    const jobsRes = await sql`
      SELECT *
      FROM jobs
      ${whereClause}
      ORDER BY days_since_posted ASC, created_at DESC, id DESC
      LIMIT ${limit} OFFSET ${offset};
    ` as TypeJobDB[];

    // Récupérer le total
    const countRes = await sql`
      SELECT COUNT(*)::int AS count
      FROM jobs
      ${whereClause};
    `;

    const totalJobs = countRes[0]?.count ?? 0;

    return {
      jobs: mapJobs(jobsRes),
      nbTotalJobs: totalJobs,
      success: true,
      error: '',
    };

  } catch (err) {
    console.error('Error executing search query:\n', err);
    return {
      jobs: [],
      nbTotalJobs: 0,
      success: false,
      error: 'Une erreur est survenue',
    };
  }
}

function mapJobs(rows: TypeJobDB[]) {
  return rows.map((row) => ({
    link: row.url,
    title: row.title,
    company: row.company,
    contractType: row.contract,
    location: row.location,
    timeSincePosted: formatTimeSincePosted(row.days_since_posted),
    img: row.image_url || undefined,
  } as TypeJob));
}

function formatTimeSincePosted(daysSincePosted: number | null) {
  if (daysSincePosted === null) return '';
  if (daysSincePosted === 0) return 'Aujourd\'hui';
  return `Il y a ${daysSincePosted} jour${daysSincePosted > 1 ? 's' : ''}`;
}