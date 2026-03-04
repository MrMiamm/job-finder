// server/api/jobs/[query].ts

import searchJobs from "~~/server/utils/searchJobs";
import { TypeError } from "~~/shared/types";

export default defineEventHandler(async (event) => {
  // Paramètre de route
  const { query } = event.context.params!;
  const search = decodeURIComponent(query || '');

  // Query params (GET)
  const queryParams = getQuery(event);
  const contracts = queryParams.contract == '' ? [] : (queryParams.contract as string).split(',');
  const location = queryParams.location as string || null;

  // Appel à la fonction de recherche
  try {
    const results = await searchJobs(search, contracts, location);
    return results;
  } catch (error) {
    return { error: 'An error occurred while searching for jobs.' } as TypeError;
  }
});