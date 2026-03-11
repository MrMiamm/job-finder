import { Pool } from 'pg';
import { ApiSearchResult, TypeJob } from '#shared/types';
import { capitalize } from 'vue';

// Crée un pool global une seule fois
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

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

export default async function(
  search: string,
  contracts: string[] | null,
  location: string | null,
  limit: number = 20,
  page: number = 1
): Promise<ApiSearchResult> {

  const conditions: string[] = [];
  const params: any[] = [];

  // full-text search
  if (search !== 'all') {
    params.push(search);
    conditions.push(`search_vector @@ websearch_to_tsquery('french', unaccent($${params.length}))`);
  }

  // contracts filter
  if (contracts?.length) {
    params.push(contracts);
    conditions.push(`contract = ANY($${params.length})`);
  }

  // location filter
  if (location) {
    params.push(capitalize(location));
    conditions.push(`location = $${params.length}`);
  }

  // construction WHERE clause
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const offset = (page - 1) * limit;
  params.push(limit, offset);

  const jobsSql = `
    SELECT *
    FROM jobs
    ${whereClause}
    ORDER BY days_since_posted ASC, created_at DESC, id DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `

  const countSql = `
    SELECT COUNT(*)::int
    FROM jobs
    ${whereClause}
  `

  try {
    const [jobsRes, countRes] = await Promise.all([
      pool.query(jobsSql, params),
      pool.query(countSql, params.slice(0, params.length - 2))
    ])

    const totalJobs = countRes.rows[0].count;

    return {
      jobs: mapJobs(jobsRes.rows),
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
    }
  }
}

function mapJobs(rows: TypeJobDB[]) {
  return rows.map((row) => {
    return {
      link: row.url,
      title: row.title,
      company: row.company,
      contractType: row.contract,
      location: row.location,
      timeSincePosted: formatTimeSincePosted(row.days_since_posted),
      img: row.image_url || undefined,
    } as TypeJob;
  });
}

function formatTimeSincePosted(daysSincePosted: number | null) {
  if (daysSincePosted === null) return '';
  if (daysSincePosted === 0) return 'Aujourd\'hui';
  return `Il y a ${daysSincePosted} jour${daysSincePosted > 1 ? 's' : ''}`;
}
