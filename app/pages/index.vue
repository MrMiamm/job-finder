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
    :animate-next="animateNextBtn"
    :animate-previous="animatePreviousBtn"
    class="mb-2"  
  />
  
  <div class="w-full flex flex-col items-center transition-opacity duration-300 ease" :class="{'opacity-50': searchBar.status === 'loading'}">
    <Title2 v-if="searchBar.status === 'idle'" class="mb-4">Recherchez un emploi</Title2>
    <Title2 v-else-if="searchBar.status === 'error'" class="mb-4 text-red-500">Une erreur est survenue</Title2>
    <Title2 v-else-if="searchBar.status === 'success' && searchBar.jobs && searchBar.jobs.length === 0" class="mb-4">Aucune offre trouvée</Title2>
    <ContainersJobCards v-else-if="(searchBar.status === 'success' || searchBar.status === 'loading') && searchBar.jobs" :jobs="searchBar.jobs" />
    <Icon 
      v-if="searchBar.status === 'loading'" 
      class="absolute left-1/2 -translate-x-1/2 pt-4 text-primary animate-show" 
      name="eos-icons:three-dots-loading" 
      size="96" 
    />
  </div>

  <ContainersNavBar 
    v-if="searchBar.jobs && searchBar.jobs.length > 4"
    v-model:page="page" 
    v-model:total="searchBar.nbTotalJobs" 
    v-model:last-page="lastPage"
    :nb-jobs-per-page="NB_JOBS_PER_PAGE"
    :show-nb-total-jobs="false"
    :animate-next="animateNextBtn"
    :animate-previous="animatePreviousBtn"
    class="mt-2"  
  />
</template>

<script lang="ts" setup>
import type { SearchResult } from '~~/shared/types';

const NB_JOBS_PER_PAGE = 20
const page = ref<number>()

const searchBar = ref<SearchResult>({
  jobs: [],
  nbTotalJobs: 0,
  status: 'idle'
})

const lastPage = computed(() => {
  return Math.ceil(searchBar.value.nbTotalJobs / NB_JOBS_PER_PAGE)
})

/*******************************************************************************/

const animatePreviousBtn = ref(false)
const animateNextBtn = ref(false)

function onKeydown(e: KeyboardEvent) {
  if (!page.value) return

  if (e.key === 'ArrowLeft' && page.value > 1) {
    animate(animatePreviousBtn)
    page.value--
  }

  if (e.key === 'ArrowRight' && page.value < lastPage.value) {
    animate(animateNextBtn)
    page.value++
  }
}
useKeydown(onKeydown)
</script>