// server/api/jobs/[query].ts

import searchJobs from "~~/server/utils/searchJobs";
import { ApiSearchResult } from "~~/shared/types";

export default defineEventHandler(async (event): Promise<ApiSearchResult> => {
  // Paramètre de route
  const { query } = event.context.params!;
  const search = decodeURIComponent(query || '');

  // Params POST
  const body = await readBody(event);
  const location = body.location;
  const contracts = body.contracts;
  const limit = body.limit
  const page = body.page;

  // Appel à la fonction de recherche
  return await searchJobs(search, contracts, location, limit, page);
});