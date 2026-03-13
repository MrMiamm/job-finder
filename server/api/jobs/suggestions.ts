// server/api/jobs/autocomplete/location/[location].ts

import { locationSuggestions } from "~~/server/utils/suggestions";

export default defineEventHandler(async (event): Promise<string[]> => {
  // Params POST
  const body = await readBody(event);
  const search = body.search;
  const location = body.location;

  let result: string[] = [];

  if (search) {
    result.push(...await searchSuggestions(search));
  } 
  if (location) {
    result.push(...await locationSuggestions(location));
  } 

  return result;
});