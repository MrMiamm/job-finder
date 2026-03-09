<template>
  <ContainersRow class="bg-secondary-bg justify-center py-2">

    <InputsField 
      v-model="search"
      v-model:isFocused="focusSearchInput"
      blacklist="1"
      id="job-title" 
      name="Métier" 
      icon="mdi:compass-outline" 
      placeholder="Métier, entreprise, ..." 
    >
      <KeyIcon name="icon-park-twotone:one-key" />
    </InputsField>
    <InputsField 
      v-model="location"
      v-model:isFocused="focusLocationInput"
      blacklist="2"
      id="job-location" 
      name="Métier" 
      icon="teenyicons:pin-outline" 
      placeholder="Paris, Toulouse, ..." 
    >
      <KeyIcon name="icon-park-twotone:two-key" />
    </InputsField>
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
    >
      <KeyIcon name="icon-park-twotone:three-key" />
    </InputsMultiSelect>

    <InputsButtonIcon 
      ref="searchButton"
      class="shadow-sm" 
      :class="{ 'animate-key-button': animSearchBtn }"
      transition="scale" 
      icon="teenyicons:search-outline"
      :isDisabled="isSearchBtnDisabled"
      @click="submit(1)"
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
  isSearchBtnDisabled.value = true

  pageModel.value = page

  resultModel.value = {
    jobs: resultModel.value ? resultModel.value.jobs : [],
    nbTotalJobs: resultModel.value ? resultModel.value.nbTotalJobs : 0,
    status: 'loading',
  }

  const data = await $fetch<ApiSearchResult>(`/api/jobs/${search.value || 'all'}`, {
    method: 'POST',
    body: {
      location: location.value,
      contracts: contracts.value,
      limit: props.nbJobsPerPage,
      page
    },
  })
  
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

watch(pageModel, (page) => {
  submit(page)
})
</script>