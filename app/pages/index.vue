<template>
  <ContainersSearchBar 
    v-model:page="page"
    v-model:result="searchBar" 
    :nb-jobs-per-page="NB_JOBS_PER_PAGE"
    class="mb-2" 
  />

  <ContainersNavBar 
    v-model:page="page" 
    v-model:total="searchBar.nbTotalJobs" 
    v-model:last-page="lastPage"
    :nb-jobs-per-page="NB_JOBS_PER_PAGE"
    class="mb-2"  
  />
  
  <div class="w-full flex flex-col items-center">
    <Title2 v-if="searchBar.status === 'error'" class="mb-4 text-red-500">Une erreur est survenue</Title2>
    <Title2 v-else-if="searchBar.status === 'success' && searchBar.jobs && searchBar.jobs.length === 0" class="mb-4">Aucune offre trouvée</Title2>
    <ContainersJobCards v-else-if="searchBar.status === 'success' && searchBar.jobs" :jobs="searchBar.jobs" />
    <Title2 v-else-if="searchBar.status === 'idle'" class="mb-4">Recherchez un emploi</Title2>
    <Icon v-else-if="searchBar.status === 'pending'" class="text-primary" name="eos-icons:three-dots-loading" size="96" />
  </div>

  <ContainersNavBar 
    v-if="lastPage > 1"
    v-model:page="page" 
    v-model:total="searchBar.nbTotalJobs" 
    v-model:last-page="lastPage"
    :nb-jobs-per-page="NB_JOBS_PER_PAGE"
    :show-nb-total-jobs="false"
    class="mt-2"  
  />
</template>

<script lang="ts" setup>
import type { SearchResult } from '~~/shared/types';

const NB_JOBS_PER_PAGE = 20
const page = ref<number>()

const searchBar = ref<SearchResult>({
  status: 'idle',
  jobs: [],
  nbTotalJobs: 0
})

const lastPage = computed(() => {
  return Math.ceil(searchBar.value.nbTotalJobs / NB_JOBS_PER_PAGE)
})
</script>