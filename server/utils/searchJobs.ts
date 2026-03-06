import { Pool } from 'pg';
import { TypeJob } from '#shared/types';
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

export default async function(search: string, contracts: string[] | null, location: string | null): Promise<TypeJob[]> {

  let sql = `SELECT * FROM jobs`;

  const conditions: string[] = [];
  const params: any[] = [];

  if (search !== 'all') {
    params.push(search);
    conditions.push(`search_vector @@ websearch_to_tsquery('french', unaccent($${params.length}))`);
  }

  if (contracts?.length) {
    params.push(contracts);
    conditions.push(`contract = ANY($${params.length})`);
  }

  if (location) {
    params.push(capitalize(location));
    conditions.push(`location = $${params.length}`);
  }

  if (conditions.length) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  sql += ` ORDER BY created_at DESC`;

  try {
    const res = await pool.query(sql, params);
    return mapJobs(res.rows);
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