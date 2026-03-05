<template>
  <ContainersSearchBar v-model="searchBar" class="mb-6" />
  <div class="w-full flex flex-col items-center">
    <Title2 v-if="searchBar.status === 'error'" class="mb-4 text-red-500">Une erreur est survenue</Title2>
    <Title2 v-else-if="searchBar.status === 'success' && searchBar.jobs && searchBar.jobs.length === 0" class="mb-4">Aucune offre trouvée</Title2>
    <ContainersJobCards v-else-if="searchBar.status === 'success' && searchBar.jobs" :jobs="searchBar.jobs" />
    <Icon v-else-if="searchBar.status === 'pending'" class="text-primary" name="eos-icons:three-dots-loading" size="96" />
    
  </div>
</template>

<script lang="ts" setup>
import type { SearchResult } from '~~/shared/types';

const searchBar = ref<SearchResult>({
  status: 'pending',
  jobs: []
})
</script>