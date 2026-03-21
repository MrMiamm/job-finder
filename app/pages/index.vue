<template>
  <div class="flex flex-col items-center gap-2">
    <ContainersRow class="justify-center">
      <ContainersSearchBar 
        v-model:page="page"
        v-model:result="searchBar" 
        v-model:focus="focusSearch"
        :nb-jobs-per-page="NB_JOBS_PER_PAGE"
      />
    </ContainersRow>

    <ContainersNavBar 
      v-model:page="page" 
      v-model:total="searchBar.nbTotalJobs" 
      v-model:last-page="lastPage"
      :nb-jobs-per-page="NB_JOBS_PER_PAGE"
      :animate-next="animateNextBtn"
      :animate-previous="animatePreviousBtn"
    />
    
    <div class="w-full flex flex-col items-center transition-opacity duration-300 ease" :class="{'opacity-50': searchBar.status === 'loading'}">
      <ContainersBasicCard 
        v-if="searchBar.status === 'idle'" 
        class="mb-4 lg:mt-10"
      >
        <Title2>Trouvez votre prochain job dans l'IT</Title2>
        
        <p class="text-sm opacity-70 mb-4">
          Recherchez par mot-clé, entreprise ou localisation
        </p>

        <InputsButtonNormal 
          @click="focusSearch = true"
        >
          Commencer
        </InputsButtonNormal>
      </ContainersBasicCard>
      <Title2 
        v-else-if="searchBar.status === 'error'" 
        aria-live="polite" 
        class="mb-4 text-red-500"
      >
        Une erreur est survenue
      </Title2>
      <Title2 
        v-else-if="searchBar.status === 'success' && (searchBar.nbTotalJobs === 0 || searchBar.jobs && searchBar.jobs.length === 0)" 
        aria-live="polite"
        class="mb-4"
      >
        Aucune offre trouvée
      </Title2>
      <ContainersJobCards 
        v-else-if="(searchBar.status === 'success' || searchBar.status === 'loading') && searchBar.jobs" :jobs="searchBar.jobs" 
        :aria-busy="searchBar.status === 'loading'"
      />
      <Icon 
        v-if="searchBar.status === 'loading'" 
        aria-hidden="true"
        class="absolute left-1/2 -translate-x-1/2 pt-4 text-primary-bg animate-show" 
        name="eos-icons:three-dots-loading" 
        size="96" 
      />
    </div>

    <ContainersNavBar 
      v-if="searchBar.jobs && searchBar.jobs.length > 4"
      aria-hidden="true"
      v-model:page="page" 
      v-model:total="searchBar.nbTotalJobs" 
      v-model:last-page="lastPage"
      :nb-jobs-per-page="NB_JOBS_PER_PAGE"
      :show-nb-total-jobs="false"
      :animate-next="animateNextBtn"
      :animate-previous="animatePreviousBtn"
    />
  </div>
</template>

<script lang="ts" setup>
import type { SearchResult } from '~~/shared/types';

const NB_JOBS_PER_PAGE = 20
const page = ref<number>()
const focusSearch = ref(false)

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