// server/api/jobs/[query].ts

import { searchJobs } from "~~/server/utils/search";
import { ApiSearchResult } from "~~/shared/types";

export default defineEventHandler(async (event): Promise<ApiSearchResult> => {
  // Paramètre de route

  // Params POST
  const body = await readBody(event);
  const search = body.search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const location = body.location;
  const contracts = body.contracts;
  const limit = body.limit
  const page = body.page;

  // Appel à la fonction de recherche
  const result = await searchJobs(search, contracts, location, limit, page);
  return result;
});