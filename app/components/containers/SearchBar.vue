<template>
  <ContainersRow class="bg-secondary-bg justify-between sm:justify-start px-4 py-2 rounded-2xl">

    <InputsFieldWithSuggestions
      v-model="search"
      v-model:isFocused="focusSearchInput"
      blacklist="1"
      id="job-title" 
      icon="mdi:compass-outline" 
      placeholder="Métier, entreprise, ..." 
      :suggestions="searchSuggestions"
      :nbCharForSuggestion="2"
      classWrapper="w-full lg:w-80 min-w-fit grow-8"
    >
      <KeyIcon name="icon-park-twotone:one-key" />
    </InputsFieldWithSuggestions>
    <InputsFieldWithSuggestions 
      v-model="location"
      v-model:isFocused="focusLocationInput"
      blacklist="2"
      id="job-location" 
      icon="teenyicons:pin-outline" 
      placeholder="Paris, Toulouse, ..." 
      :suggestions="locationSuggestions"
      :nbCharForSuggestion="1"
      classWrapper="w-full sm:w-fit grow-5"
    >
      <KeyIcon name="icon-park-twotone:two-key" />
    </InputsFieldWithSuggestions>
    <InputsMultiSelect 
      v-model="contracts"
      keyToggle="3"
      :options="[
        EnumContract.CDI,
        EnumContract.CDD,
        EnumContract.Alternance,
        EnumContract.Stage
      ]"
      placeholder="Type de contrat" 
      class="grow"
    >
      <KeyIcon name="icon-park-twotone:three-key" />
    </InputsMultiSelect>

    <InputsButtonIcon 
      ref="searchButton"
      class="shadow-sm ml-auto" 
      :class="{ 'animate-key-button': animSearchBtn }"
      transition="scale" 
      icon="teenyicons:search-outline"
      :isDisabled="isSearchBtnDisabled"
      @click="handleSearch"
    >
      Rechercher
      <KeyIcon name="icon-park-twotone:enter-key" />
    </InputsButtonIcon>
  </ContainersRow>
</template>

<script lang="ts" setup>
import { EnumContract } from '~~/shared/enums';
import type { ApiSearchResult, SearchResult } from '~~/shared/types';

const isSearchBtnDisabled = ref(false)
const search = ref<string>("")
const location = ref<string>("")
const contracts = ref<string[]>([])
const lastQuery = ref('')

const props = defineProps<{
  nbJobsPerPage: number
}>()

const resultModel = defineModel<SearchResult>('result')
const pageModel = defineModel<number>('page', {
  default: 0
})

/**
 * La fonction submit() permet de lancer une recherche d'offres d'emploi
 * en fonction des paramètres de recherche définis dans les champs de
 * formulaire : métier, localisation et type de contrat.
 * La fonction met à jour le modèle de recherche avec les offres d'emploi
 * trouvées.
 */
async function submit(page: number) {

  const query = JSON.stringify({
    search: search.value,
    location: location.value,
    contracts: contracts.value,
    page
  })

  if (query === lastQuery.value) return
  lastQuery.value = query

  isSearchBtnDisabled.value = true

  resultModel.value = {
    jobs: resultModel.value ? resultModel.value.jobs : [],
    nbTotalJobs: resultModel.value ? resultModel.value.nbTotalJobs : 0,
    status: 'loading',
  }

  const data = await $fetch<ApiSearchResult>('/api/jobs/query', {
    method: 'POST',
    body: {
      search: search.value || 'all',
      location: location.value,
      contracts: contracts.value,
      limit: props.nbJobsPerPage,
      page
    },
  })
  
  pageModel.value = page
  resultModel.value = {
    jobs: data.jobs || [],
    nbTotalJobs: data.nbTotalJobs || 0,
    status: data.success ? 'success' : data.error ? 'error' : 'idle',
  }

  isSearchBtnDisabled.value = false
}

/**************************************************************************************/

const animSearchBtn = ref(false)
const focusSearchInput = ref(false)
const focusLocationInput = ref(false)
const focusContractsInput = ref(false)

/**
 * Fonction appelée lorsque l'utilisateur appuie sur la touche Entrée
 * Elle lance la recherche des offres d'emploi
 * @param {KeyboardEvent} e - L'événement de touche
 */
function onpressKey(e: KeyboardEvent) {
  if (e.repeat) return
  if (e.key === 'Enter' && !isSearchBtnDisabled.value) {

    // unfocus des inputs
    focusSearchInput.value = false
    focusLocationInput.value = false
    focusContractsInput.value = false

    animate(animSearchBtn)
    submit(1)
  }

  if (e.key === '1') {
    focusSearchInput.value = true
  }

  if (e.key === '2') {
    focusLocationInput.value = true
  }

  if (e.key === '3') {
    focusContractsInput.value = true
  }
}
useKeydown(onpressKey)

/*******************************************************************************************/

function handleSearch() {
  if (pageModel.value === 1) {
    submit(1)
  } else {
    pageModel.value = 1
  }
}

watch(pageModel, (page) => {
  submit(page)
})

/*******************************************************************************************/

const searchSuggestions = ref<string[]>([]);
const locationSuggestions = ref<string[]>([]);

watch(search, async (val) => {
  if (val.length >= 2) {
    searchSuggestions.value = await $fetch<string[]>('/api/jobs/suggestions', {
      method: 'POST',
      body: { search: val }
    });
  }
})

watch(location, async (val) => {
  if (val.length >= 1) {
    locationSuggestions.value = await $fetch<string[]>('/api/jobs/suggestions', {
      method: 'POST',
      body: { location: val }
    });
  }
})

</script>