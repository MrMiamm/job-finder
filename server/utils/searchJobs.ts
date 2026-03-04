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
  contract_type: string;
  salary_min: number | null;
  salary_max: number | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export default async function(search: string, contracts: string[] | null, location: string | null): Promise<TypeJob[]> {
  // Construire la requête SQL
  let sql = `
    SELECT * 
    FROM jobs 
    WHERE TRUE
  `;
  const params: any[] = [];

  if (search !== 'all') {
    sql = `
      SELECT * 
      FROM jobs 
      WHERE to_tsvector('french', title || ' ' || company) @@ plainto_tsquery('french', $1)
    `;
    params.push(search)
  }

  if (contracts && contracts.length > 0) {
    sql += ` AND (contract_type = $${params.length + 1}`;
    params.push(contracts[0])
    let index = 1
    while (index < contracts.length) {
      sql += ` OR contract_type = $${params.length + 1}`;
      params.push(contracts[index])
      index++;
    }
    sql += `)`
  }

  if (location) {
    sql += ` AND location = $${params.length + 1}`;
    params.push(capitalize(location));
  }

  sql += ` ORDER BY id DESC`;
  console.log(sql) 

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
    // Calculer le temps depuis la publication
    const now = new Date();
    const diffMs = now.getTime() - row.created_at.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let timeSincePosted = '';
    if (diffDays === 0) {
      timeSincePosted = 'Posté Aujourd\'hui';
    } else if (diffDays === 1) {
      timeSincePosted = 'Posté hier';
    } else {
      timeSincePosted = `Il y a ${diffDays} jours`;
    }

    return {
      link: row.url,
      title: row.title,
      company: row.company,
      contractType: row.contract_type,
      location: row.location,
      timeSincePosted,
      img: row.image_url || undefined,
    } as TypeJob;
  });
}