// server/api/jobs/[query].ts

import searchJobs from "~~/server/utils/searchJobs";
import { ApiResponse, TypeCursor, TypeError } from "~~/shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse | TypeError> => {
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
  try {
    const results = await searchJobs(search, contracts, location, limit, page);
    return results;
  } catch (error) {
    return { error: 'An error occurred while searching for jobs.' } as TypeError;
  }
});