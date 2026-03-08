import { Pool } from 'pg';
import { ApiResponse, TypeCursor, TypeJob } from '#shared/types';
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
  time_since_posted: string;
  search_vector: string;
}

export default async function(
  search: string,
  contracts: string[] | null,
  location: string | null,
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse> {

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

  // CTE pour filtrer une seule fois
  const sql = `
    WITH filtered_jobs AS (
      SELECT *
      FROM jobs
      ${whereClause}
    )
    SELECT *, COUNT(*) OVER() AS total_count
    FROM filtered_jobs
    ORDER BY created_at DESC, id DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  try {
    const res = await pool.query(sql, params);

    const totalJobs = res.rows.length > 0 ? parseInt(res.rows[0].total_count, 10) : 0;

    return {
      jobs: mapJobs(res.rows),
      nbJobs: totalJobs,
    };

  } catch (err) {
    console.error('Error executing search query:', err);
    throw err;
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
      timeSincePosted: row.time_since_posted,
      img: row.image_url || undefined,
    } as TypeJob;
  });
}